import { Controller, Get, Post, Body, Req, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get agency billing status, plan & payment methods' })
  async getBillingStatus(@Req() req: any) {
    return this.billingService.getBillingStatus(req.user.id);
  }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create Stripe Checkout Session' })
  async createCheckoutSession(
    @Body() body: { plan: string },
    @Req() req: any,
  ) {
    return this.billingService.createCheckoutSession(req.user.id, body.plan);
  }

  @Post('portal')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create Stripe Customer Portal session' })
  async createCustomerPortalSession(@Req() req: any) {
    return this.billingService.createCustomerPortalSession(req.user.id);
  }

  @Post('payment-method')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Attach or update payment method details' })
  async updatePaymentMethod(
    @Body() body: { brand?: string; last4?: string; expMonth?: number; expYear?: number },
    @Req() req: any,
  ) {
    return this.billingService.updatePaymentMethod(req.user.id, body);
  }

  @Post('cancel')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Cancel paid subscription and downgrade to STARTER' })
  async cancelSubscription(@Req() req: any) {
    return this.billingService.cancelSubscription(req.user.id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe Webhook Listener' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    return this.billingService.handleWebhook(signature, req.rawBody as Buffer);
  }
}
