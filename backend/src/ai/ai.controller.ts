import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AiService, ReportMetrics } from './ai.service';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('summarize')
  @ApiOperation({ summary: 'Generate AI summary for report metrics' })
  summarize(
    @Body()
    body: {
      agencyName: string;
      clientName: string;
      metrics: ReportMetrics;
    },
  ) {
    return this.aiService.generateReportSummary(
      body.agencyName,
      body.clientName,
      body.metrics,
    );
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI assistant' })
  chat(@Body() body: { message: string }) {
    return this.aiService.chat(body.message);
  }
}
