import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private twilioClient: Twilio | null = null;
  private twilioPhone: string;

  constructor(
    private configService: ConfigService,
    private aiService: AiService,
    private prisma: PrismaService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioPhone = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER') || 'whatsapp:+14155238886'; // Twilio sandbox default

    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
      this.logger.log('Twilio client initialized');
    } else {
      this.logger.warn('Twilio credentials not found. WhatsappService will run in MOCK mode.');
    }
  }

  /**
   * Sends a WhatsApp message via Twilio (or mocks it)
   */
  async sendMessage(to: string, body: string): Promise<any> {
    const toPhone = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    
    if (!this.twilioClient) {
      this.logger.log(`[MOCK WHATSAPP] To: ${toPhone} | Body: ${body}`);
      return { sid: 'mock-msg-' + Date.now() };
    }

    try {
      const message = await this.twilioClient.messages.create({
        body,
        from: this.twilioPhone,
        to: toPhone,
      });
      this.logger.log(`WhatsApp message sent: ${message.sid}`);
      return message;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Processes incoming WhatsApp messages
   */
  async handleIncomingMessage(sender: string, body: string): Promise<void> {
    this.logger.log(`Received WhatsApp from ${sender}: ${body}`);
    
    // In a real app, we'd map 'sender' phone number to a specific Client in the DB.
    // For MVP, we will assume it's a generic client asking a question about their data.
    // We fetch a mock context and pass it to AiService.
    
    try {
      const mockClientContext = `
        You are a helpful AI assistant for an agency reporting tool. 
        The client is asking a question via WhatsApp.
        Client Name: Acme Corp
        Recent Performance:
        - Sessions: 124,592 (+14%)
        - Conversions: 3,842 (+8%)
        - CPA: $42.50 (-5%)
      `;

      // Use AI service to generate a conversational response
      const prompt = `Context: ${mockClientContext}\nUser Message: ${body}`;
      const reply = await this.aiService.chat(prompt);
      
      // Send the reply back to the user via WhatsApp
      await this.sendMessage(sender, reply);
      
    } catch (error) {
      this.logger.error('Failed to handle incoming WhatsApp message', error);
      await this.sendMessage(sender, "I'm sorry, I'm having trouble retrieving your data right now. Please check the dashboard or ask your agency representative.");
    }
  }
}
