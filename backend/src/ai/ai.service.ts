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
      const sessionChange =
        metrics.previousSessions && metrics.previousSessions > 0 && metrics.sessions !== undefined
          ? Math.round(((metrics.sessions - metrics.previousSessions) / metrics.previousSessions) * 100)
          : null;

      const convChange =
        metrics.previousConversions && metrics.previousConversions > 0 && metrics.conversions !== undefined
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
    const sessionChange =
      metrics.previousSessions && metrics.previousSessions > 0
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
      return this.localChat(message);
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
      // Gracefully fall back to local chat instead of erroring out
      return this.localChat(message);
    }
  }

  async generateActionPlan(
    agencyName: string,
    clientName: string,
    metrics: ReportMetrics,
  ): Promise<{ plan: string; actionItems: { task: string; priority: 'High' | 'Medium' | 'Low' }[] }> {
    if (!this.openai || this.config.get('USE_MOCK_AI') === 'true') {
      return this.generateMockActionPlan(clientName, metrics);
    }

    try {
      const prompt = `
You are an expert digital marketing strategist. Based on the following performance data for ${clientName} (managed by ${agencyName}), generate a proactive, concrete action plan.

Data:
- Sessions: ${metrics.sessions || 'N/A'}
- Conversions: ${metrics.conversions || 'N/A'}
- Conversion Rate: ${metrics.conversionRate || 'N/A'}%
- Revenue: ${metrics.revenue ? '$' + metrics.revenue : 'N/A'}
- Bounce Rate: ${metrics.bounceRate || 'N/A'}%

Instructions:
1. Provide a short 2-3 sentence strategic rationale (the "plan" field).
2. Generate exactly 3 actionable tasks to improve performance next month.
3. Assign a priority (High, Medium, Low) to each task.

Return JSON format:
{
  "plan": "...",
  "actionItems": [
    { "task": "...", "priority": "High" }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: this.config.get('OPENAI_MODEL', 'gpt-4o'),
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 500,
      });

      return JSON.parse(response.choices[0].message.content ?? '{}');
    } catch (error) {
      this.logger.error('OpenAI action plan error: ' + error.message);
      return this.generateMockActionPlan(clientName, metrics);
    }
  }

  private generateMockActionPlan(clientName: string, metrics: ReportMetrics): { plan: string; actionItems: { task: string; priority: 'High' | 'Medium' | 'Low' }[] } {
    const convRate = metrics.conversionRate || 3.2;
    return {
      plan: `Based on ${clientName}'s conversion rate of ${convRate}%, the immediate focus should be on middle-of-funnel optimization and reducing bounce rates on key landing pages. Redirecting ad spend from underperforming campaigns to high-intent search queries will yield immediate improvements.`,
      actionItems: [
        { task: 'Implement A/B testing on the primary lead capture form to improve the 3.2% conversion rate.', priority: 'High' as 'High' },
        { task: 'Audit and pause the bottom 20% performing Meta Ad sets based on CPA.', priority: 'High' as 'High' },
        { task: 'Create two new blog posts targeting long-tail keywords to capitalize on rising organic momentum.', priority: 'Medium' as 'Medium' }
      ]
    };
  }

  private localChat(message: string): string {
    const msg = message.toLowerCase();

    if (msg.includes('report') && (msg.includes('create') || msg.includes('generate') || msg.includes('make'))) {
      return "To generate a report, go to **Reports** in the sidebar and click **Generate Report**. Select a client, choose your date range, and I'll create an AI-powered performance summary with actionable insights. You can then share the report via a public link or export it as PDF.";
    }
    if (msg.includes('client') && (msg.includes('add') || msg.includes('create') || msg.includes('new'))) {
      return "To add a new client, navigate to **Clients** in the sidebar and click the **Add Client** button. Fill in their name, email, website, and timezone. Once added, you can start generating reports and tracking their performance.";
    }
    if (msg.includes('integration') || msg.includes('connect') || msg.includes('google ads') || msg.includes('meta ads')) {
      return "You can connect data sources in the **Integrations** section. We support Google Ads, Meta Ads, Google Analytics, and custom data sources. Click **Connect** next to any provider and follow the OAuth flow to authorize access to your client's data.";
    }
    if (msg.includes('seo') || msg.includes('search engine') || msg.includes('organic')) {
      return "For SEO analysis, I recommend tracking these key metrics:\n\n1. **Organic Traffic** — Monitor session trends over time\n2. **Keyword Rankings** — Track your top 20 keywords weekly\n3. **Bounce Rate** — Aim for under 40% for content pages\n4. **Core Web Vitals** — LCP, FID, and CLS scores\n5. **Backlink Profile** — Quality over quantity\n\nUse the **Competitor Scraper** tool to analyze competitor websites and find content gaps.";
    }
    if (msg.includes('conversion') || msg.includes('cro') || msg.includes('optimize')) {
      return "Here are proven CRO strategies:\n\n1. **A/B test CTAs** — Try different colors, copy, and placement\n2. **Simplify forms** — Reduce fields to the essentials\n3. **Add social proof** — Testimonials and trust badges\n4. **Speed optimization** — Every 1s delay reduces conversions by 7%\n5. **Mobile-first design** — 68%+ of traffic is mobile\n\nYour current conversion rate benchmark is 2.5-3.5% for most industries.";
    }
    if (msg.includes('template') || msg.includes('dashboard')) {
      return "ReportIQ offers customizable report templates. Go to **Templates Builder** to create or modify templates. You can drag and drop widgets, customize colors to match your client's brand, and save templates for reuse across multiple clients.";
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! 👋 I'm your ReportIQ AI assistant. I can help you with:\n\n• **Creating reports** for your clients\n• **Marketing strategy** advice (SEO, PPC, Social)\n• **Data analysis** and performance insights\n• **Platform guidance** — how to use ReportIQ features\n\nWhat would you like help with?";
    }
    if (msg.includes('help') || msg.includes('what can you do')) {
      return "I can help you with:\n\n📊 **Reports** — Generate, customize, and schedule automated reports\n👥 **Clients** — Manage your client portfolio\n🔗 **Integrations** — Connect Google Ads, Meta Ads, GA4\n🔍 **SEO Analysis** — Keyword research, competitor analysis\n📈 **Performance** — Campaign optimization tips\n🛠️ **Platform** — Navigate ReportIQ features\n\nJust ask me anything!";
    }

    return `Great question! Here's what I can tell you about "${message}":\n\nAs a marketing analytics platform, ReportIQ helps agencies streamline their reporting workflow. I can assist with report generation, client management, SEO analysis, conversion optimization, and more.\n\nTry asking me specific questions like:\n• "How do I create a report?"\n• "Tips for improving conversion rates"\n• "How to connect Google Ads?"`;
  }
}
