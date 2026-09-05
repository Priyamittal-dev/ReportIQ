import { Controller, Post, Body, Req, Headers, Logger, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { validateRequest } from 'twilio';
import { WhatsappService } from './whatsapp.service';

@ApiTags('WhatsApp Webhook')
@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService,
  ) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Receive incoming WhatsApp messages from Twilio' })
  async handleIncomingMessage(
    @Req() req: any,
    @Body() body: any,
    @Headers('x-twilio-signature') signature?: string,
  ) {
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    // In production, enforce Twilio webhook signature verification
    if (authToken && isProd) {
      const backendUrl = this.configService.get('BACKEND_URL', 'http://localhost:4000');
      const webhookUrl = `${backendUrl}/api/whatsapp/webhook`;
      const isValid = signature ? validateRequest(authToken, signature, webhookUrl, body || {}) : false;
      if (!isValid) {
        this.logger.warn('Twilio signature verification failed');
        throw new ForbiddenException('Invalid Twilio signature');
      }
    }

    // Twilio sends data as application/x-www-form-urlencoded
    const from = body?.From || req.body?.From;
    const incomingText = body?.Body || req.body?.Body;

    if (!from || !incomingText) {
      this.logger.warn('Received invalid webhook payload from Twilio');
      return 'Invalid payload';
    }

    // Process the message asynchronously
    this.whatsappService.handleIncomingMessage(from, incomingText).catch((err) => {
      this.logger.error('Error handling async WhatsApp message', err);
    });

    return '<Response></Response>';
  }
}
