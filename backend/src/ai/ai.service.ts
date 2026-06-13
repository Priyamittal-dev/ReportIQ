import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ReportMetrics {
  sessions?: number;
  pageViews?: number;
  conversions?: number;
  conversionRate?: number;
  revenue?: number;
  bounceRate?: number;
  avgSessionDuration?: string;
  topPages?: { page: string; views: number }[];
  trafficSources?: { source: string; percentage: number }[];
  previousSessions?: number;
  previousConversions?: number;
  period?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;

  constructor(private config: ConfigService) {
    const apiKey = config.get('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'sk-your_openai_api_key') {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI connected');
    } else {
      this.logger.warn('OpenAI API key not set — using mock AI summaries');
    }
  }

  async generateReportSummary(
    agencyName: string,
    clientName: string,
    metrics: ReportMetrics,
  ): Promise<{ summary: string; insights: string[] }> {
    if (!this.openai || this.config.get('USE_MOCK_AI') === 'true') {
      return this.generateMockSummary(clientName, metrics);
    }

    try {
      const sessionChange = metrics.previousSessions && metrics.sessions
      ? Math.round(((metrics.sessions - metrics.previousSessions) / metrics.previousSessions) * 100)
      : null;

    const convChange = metrics.previousConversions && metrics.conversions
      ? Math.round(((metrics.conversions - metrics.previousConversions) / metrics.previousConversions) * 100)
      : null;

      const prompt = `
You are an expert digital marketing analyst writing a client performance report for ${agencyName}.
Write a professional, encouraging, and data-driven report summary for their client: ${clientName}.

Period: ${metrics.period || 'This month'}

Key metrics:
- Sessions: ${metrics.sessions?.toLocaleString() || 'N/A'} (${sessionChange !== null ? `${sessionChange > 0 ? '+' : ''}${sessionChange}% vs last period` : ''})
- Page Views: ${metrics.pageViews?.toLocaleString() || 'N/A'}
- Conversions: ${metrics.conversions || 'N/A'} (${convChange !== null ? `${convChange > 0 ? '+' : ''}${convChange}% vs last period` : ''})
- Conversion Rate: ${metrics.conversionRate || 'N/A'}%
- Revenue: ${metrics.revenue ? '$' + metrics.revenue.toLocaleString() : 'N/A'}
- Bounce Rate: ${metrics.bounceRate || 'N/A'}%
- Avg Session Duration: ${metrics.avgSessionDuration || 'N/A'}
- Top Traffic Sources: ${metrics.trafficSources?.map(s => `${s.source} (${s.percentage}%)`).join(', ') || 'N/A'}

Instructions:
1. Write a concise 3-4 sentence executive summary highlighting wins and opportunities.
2. Be specific about the data — mention actual numbers.
3. Keep a professional but friendly tone.
4. Then provide exactly 3 actionable insights as bullet points.

Return JSON format:
{
  "summary": "...",
  "insights": ["insight1", "insight2", "insight3"]
}`;

      const response = await this.openai.chat.completions.create({
        model: this.config.get('OPENAI_MODEL', 'gpt-4o'),
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 600,
      });

      const result = JSON.parse(response.choices[0].message.content ?? '{}');
      return result;
    } catch (error) {
      this.logger.error('OpenAI error, falling back to mock: ' + error.message);
      return this.generateMockSummary(clientName, metrics);
    }
  }

  private generateMockSummary(
    clientName: string,
    metrics: ReportMetrics,
  ): { summary: string; insights: string[] } {
    const sessions = metrics.sessions || 3842;
    const convRate = metrics.conversionRate || 3.2;
    const sessionChange = metrics.previousSessions
      ? Math.round(((sessions - metrics.previousSessions) / metrics.previousSessions) * 100)
      : 14;

    return {
      summary: `${clientName} had an excellent performance period, achieving ${sessions.toLocaleString()} sessions — a ${sessionChange > 0 ? '+' : ''}${sessionChange}% improvement over the previous period. Organic search continues to be the primary traffic driver, contributing to a conversion rate of ${convRate}%. The site's engagement metrics are strong with above-industry-average session duration, indicating high-quality content resonating with the target audience. Overall, the digital marketing strategy is delivering measurable and consistent growth.`,
      insights: [
        `🚀 Traffic grew ${Math.abs(sessionChange)}% — capitalize on this momentum by increasing content publishing frequency in the top-performing categories.`,
        `🎯 Your ${convRate}% conversion rate is above the industry average of 2.5%. Consider A/B testing landing page CTAs to push toward the 4%+ benchmark.`,
        `📊 Mobile traffic accounts for an estimated 68% of sessions. Prioritize mobile page speed optimization to capture potential conversion uplift.`,
      ],
    };
  }

  async chat(message: string): Promise<string> {
    if (!this.openai || this.config.get('USE_MOCK_AI') === 'true') {
      return "I'm your mock AI assistant! To use the real OpenAI, make sure your API key is set and USE_MOCK_AI is false.";
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.get('OPENAI_MODEL', 'gpt-4o'),
        messages: [
          { role: 'system', content: 'You are ReportIQ AI, an expert digital marketing analyst assistant. Provide concise, helpful answers about marketing analytics, SEO, and reporting.' },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
      });

      return response.choices[0].message.content || 'No response generated.';
    } catch (error) {
      this.logger.error('OpenAI chat error: ' + error.message);
      return "Sorry, I couldn't process that request at the moment due to an API error.";
    }
  }
}
