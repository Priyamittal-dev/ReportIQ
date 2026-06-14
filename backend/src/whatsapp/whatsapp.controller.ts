import { Controller, Post, Body, Req, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';

@ApiTags('WhatsApp Webhook')
@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Receive incoming WhatsApp messages from Twilio' })
  async handleIncomingMessage(@Req() req: any, @Body() body: any) {
    // Twilio sends data as application/x-www-form-urlencoded
    const from = body.From || req.body.From;
    const incomingText = body.Body || req.body.Body;

    if (!from || !incomingText) {
      this.logger.warn('Received invalid webhook payload from Twilio');
      return 'Invalid payload';
    }

    // Process the message asynchronously so we can quickly return a 200 to Twilio
    // Twilio requires a fast response to the webhook, otherwise it considers it a failure.
    this.whatsappService.handleIncomingMessage(from, incomingText).catch((err) => {
      this.logger.error('Error handling async WhatsApp message', err);
    });

    // We can respond with standard TwiML, but returning empty 200 is sufficient
    // if we are using the REST API to send the reply back asynchronously.
    return '<Response></Response>';
  }
}
