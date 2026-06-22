import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private stripe: Stripe;
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      this.logger.warn('STRIPE_SECRET_KEY is missing. Billing will not work correctly.');
    }
    this.stripe = new Stripe(secretKey || 'sk_test_placeholder', {
      apiVersion: '2023-10-16' as any,
    });
  }

  async createCheckoutSession(userId: string, plan: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // Get price ID based on plan
    let priceId = '';
    if (plan === 'Pro') priceId = this.config.get<string>('STRIPE_PRICE_PRO') || 'price_pro_placeholder';
    else if (plan === 'Agency') priceId = this.config.get<string>('STRIPE_PRICE_AGENCY') || 'price_agency_placeholder';
    else throw new HttpException('Invalid plan selected', HttpStatus.BAD_REQUEST);

    // Create or get Stripe Customer
    let customerId = (user as any).stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId } as any,
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.config.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.config.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard/billing?canceled=true`,
      metadata: {
        userId,
        plan: plan.toUpperCase(),
      },
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      if (!webhookSecret) throw new Error('Stripe webhook secret is not set');
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`);
      throw new HttpException(`Webhook Error: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.handleSubscriptionCreated(session);
          break;
        }
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionUpdated(subscription);
          break;
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionDeleted(subscription);
          break;
        }
        default:
          this.logger.debug(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process webhook event: ${error.message}`);
    }

    return { received: true };
  }

  private async handleSubscriptionCreated(session: Stripe.Checkout.Session) {
    if (session.mode !== 'subscription') return;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan || 'PRO';

    if (!userId) {
      this.logger.warn('No userId found in checkout session metadata');
      return;
    }

    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
      } as any,
    });
    this.logger.log(`User ${userId} subscribed to ${plan}`);
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId } as any,
    });

    if (!user) return;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      } as any,
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId } as any,
    });

    if (!user) return;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        plan: 'STARTER',
        stripeSubscriptionId: null,
        stripePriceId: null,
      } as any,
    });
    this.logger.log(`User ${user.id} subscription deleted, reverted to STARTER`);
  }
}
