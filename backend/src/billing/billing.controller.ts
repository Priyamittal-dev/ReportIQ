import { Controller, Post, Body, Req, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';
import { Request } from 'express';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

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

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe Webhook Listener' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    // Note: Raw body is required for Stripe signature verification.
    // Ensure main.ts configures NestJS to provide raw body (e.g. app.useBodyParser('json', { rawBody: true }))
    return this.billingService.handleWebhook(signature, req.rawBody as Buffer);
  }
}
