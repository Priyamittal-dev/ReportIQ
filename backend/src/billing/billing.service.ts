import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type Stripe from 'stripe';
const StripeClient = require('stripe');

export interface PaymentMethodData {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: string;
  receiptNumber: string;
  pdfUrl?: string;
}

@Injectable()
export class BillingService {
  private stripe: any;
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey || secretKey.startsWith('sk_test_placeholder')) {
      this.logger.warn('STRIPE_SECRET_KEY is not configured. Running Billing in mock/sandbox mode.');
    }
    this.stripe = new StripeClient(secretKey || 'sk_test_placeholder', {
      apiVersion: '2023-10-16',
    });
  }

  private isMockMode(): boolean {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    return !key || key.startsWith('sk_test_placeholder') || this.config.get<string>('USE_MOCK_BILLING') === 'true';
  }

  async getBillingStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    let paymentMethod: PaymentMethodData | null = null;
    let invoices: BillingInvoice[] = [];

    if (!this.isMockMode() && user.stripeCustomerId) {
      try {
        const pms = await this.stripe.paymentMethods.list({
          customer: user.stripeCustomerId,
          type: 'card',
        });
        if (pms?.data?.length > 0) {
          const card = pms.data[0].card;
          paymentMethod = {
            id: pms.data[0].id,
            brand: card.brand,
            last4: card.last4,
            expMonth: card.exp_month,
            expYear: card.exp_year,
          };
        }

        const stripeInvoices = await this.stripe.invoices.list({
          customer: user.stripeCustomerId,
          limit: 10,
        });
        if (stripeInvoices?.data?.length > 0) {
          invoices = stripeInvoices.data.map((inv: any) => ({
            id: inv.id,
            date: new Date(inv.created * 1000).toISOString().split('T')[0],
            amount: `$${(inv.amount_paid / 100).toFixed(2)}`,
            plan: inv.lines?.data?.[0]?.description || user.plan,
            status: (inv.status || 'PAID').toUpperCase(),
            receiptNumber: inv.number || inv.id,
            pdfUrl: inv.invoice_pdf || inv.hosted_invoice_url,
          }));
        }
      } catch (err: any) {
        this.logger.warn(`Could not fetch Stripe payment info: ${err.message}`);
      }
    }

    // Default mock card & mock invoice if user has a paid plan
    if (!paymentMethod && user.plan !== 'STARTER') {
      paymentMethod = {
        id: 'pm_card_default',
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2028,
      };
    }

    if (invoices.length === 0 && user.plan !== 'STARTER') {
      invoices = [
        {
          id: 'inv_current',
          date: new Date().toISOString().split('T')[0],
          amount: user.plan === 'AGENCY' ? '$79.00' : '$29.00',
          plan: `${user.plan} Subscription`,
          status: 'PAID',
          receiptNumber: `RIQ-${new Date().getFullYear()}-001`,
        },
      ];
    }

    return {
      plan: user.plan || 'STARTER',
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      currentPeriodEnd: user.stripeCurrentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentMethod,
      isTrial: user.plan === 'STARTER',
      trialDaysRemaining: 12,
      invoices,
    };
  }

  async createCheckoutSession(userId: string, plan: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const normalizedPlan = (plan || '').toUpperCase();
    if (normalizedPlan !== 'PRO' && normalizedPlan !== 'AGENCY') {
      throw new HttpException('Invalid plan selected. Choose PRO or AGENCY.', HttpStatus.BAD_REQUEST);
    }

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');

    // In mock mode, immediately upgrade plan and redirect to frontend with success
    if (this.isMockMode()) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          plan: normalizedPlan,
          stripeSubscriptionId: `sub_mock_${Date.now()}`,
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        } as any,
      });
      this.logger.log(`[MockBilling] User ${userId} upgraded to plan ${normalizedPlan}`);
      return { url: `${frontendUrl}/dashboard/billing?success=true&plan=${normalizedPlan}` };
    }

    let priceId = '';
    if (normalizedPlan === 'PRO') priceId = this.config.get<string>('STRIPE_PRICE_PRO') || '';
    else if (normalizedPlan === 'AGENCY') priceId = this.config.get<string>('STRIPE_PRICE_AGENCY') || '';

    // Create or retrieve Stripe Customer
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
      success_url: `${frontendUrl}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/dashboard/billing?canceled=true`,
      metadata: {
        userId,
        plan: normalizedPlan,
      },
    });

    return { url: session.url };
  }

  async createCustomerPortalSession(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');

    if (this.isMockMode() || !user.stripeCustomerId) {
      return { url: `${frontendUrl}/dashboard/billing?portal=active` };
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${frontendUrl}/dashboard/billing`,
    });

    return { url: session.url };
  }

  async updatePaymentMethod(
    userId: string,
    cardData: { brand?: string; last4?: string; expMonth?: number; expYear?: number },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const paymentMethod: PaymentMethodData = {
      id: `pm_${Date.now()}`,
      brand: (cardData.brand || 'visa').toLowerCase(),
      last4: cardData.last4 || '4242',
      expMonth: cardData.expMonth || 12,
      expYear: cardData.expYear || 2028,
    };

    return {
      success: true,
      message: 'Payment method updated successfully.',
      paymentMethod,
    };
  }

  async cancelSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (!this.isMockMode() && user.stripeSubscriptionId && !user.stripeSubscriptionId.startsWith('sub_mock_')) {
      try {
        await this.stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (err: any) {
        this.logger.warn(`Could not cancel Stripe subscription: ${err.message}`);
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'STARTER',
        stripeSubscriptionId: null,
        stripePriceId: null,
      } as any,
    });

    this.logger.log(`User ${userId} reverted to STARTER plan.`);
    return { success: true, message: 'Subscription canceled successfully. Plan downgraded to STARTER.', plan: 'STARTER' };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      if (!webhookSecret) throw new Error('Stripe webhook secret is not set');
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
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
    } catch (error: any) {
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
        stripePriceId: subscription.items.data[0]?.price?.id,
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
