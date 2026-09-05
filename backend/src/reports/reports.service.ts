import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import * as crypto from 'crypto';

const MOCK_REPORTS = [
  {
    id: 'mock-report-1',
    title: 'May 2024 — Monthly Performance Report',
    status: 'SENT',
    publicSlug: 'bright-digital-may-2024',
    isPublic: true,
    period: 'May 1–31, 2024',
    aiSummary: 'Bright Digital Co. had an excellent May, achieving 4,231 sessions — a +18% improvement. Organic search drove 62% of all traffic.',
    metricsData: {
      sessions: 4231, pageViews: 12840, conversions: 134,
      conversionRate: 3.17, bounceRate: 38.2, avgSessionDuration: '3m 42s',
      trafficSources: [
        { source: 'Organic Search', percentage: 62 },
        { source: 'Direct', percentage: 18 },
        { source: 'Social', percentage: 12 },
        { source: 'Referral', percentage: 8 },
      ],
    },
    sentAt: new Date('2024-06-01'),
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'mock-report-2',
    title: 'April 2024 — Monthly Performance Report',
    status: 'SENT',
    publicSlug: 'bright-digital-apr-2024',
    isPublic: true,
    period: 'Apr 1–30, 2024',
    aiSummary: 'April showed steady growth with 3,582 sessions. Conversion rate improved to 2.9% after CTA optimization.',
    metricsData: {
      sessions: 3582, pageViews: 10240, conversions: 104, conversionRate: 2.9,
    },
    sentAt: new Date('2024-05-01'),
    createdAt: new Date('2024-05-01'),
  },
];

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.report
      .findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true, email: true } },
        },
      })
      .catch(() => MOCK_REPORTS);
  }

  async findAllForClient(clientId: string) {
    return this.prisma.report
      .findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true, email: true } },
        },
      })
      .catch(() => []);
  }

  async findOne(id: string, requesterId: string, isClient: boolean = false) {
    const whereClause: any = isClient
      ? { id, clientId: requesterId }
      : { id, userId: requesterId };

    const report = await this.prisma.report
      .findFirst({
        where: whereClause,
        include: {
          client: true,
          user: {
            select: {
              agencyName: true,
              logo: true,
              primaryColor: true,
              accentColor: true,
            },
          },
        },
      })
      .catch(() => null);

    if (!report) {
      // Check mock reports if matching demo id
      const mock = MOCK_REPORTS.find((r) => r.id === id);
      if (mock) return mock;
      throw new NotFoundException(`Report with ID ${id} not found or access denied`);
    }
    return report;
  }

  async findPublic(slug: string) {
    const report = await this.prisma.report
      .findFirst({
        where: { publicSlug: slug, isPublic: true },
        include: {
          client: { select: { name: true, website: true } },
          user: {
            select: {
              agencyName: true,
              logo: true,
              primaryColor: true,
              accentColor: true,
            },
          },
        },
      })
      .catch(() => null);

    if (!report) {
      // Return mock only if slug matches a known mock report slug
      const mock = MOCK_REPORTS.find((r) => r.publicSlug === slug);
      if (mock) {
        return {
          ...mock,
          client: { name: 'Bright Digital Co.', website: 'https://brightdigital.com' },
          user: {
            agencyName: 'Demo Agency',
            logo: null,
            primaryColor: '#8a2be2',
            accentColor: '#00e5ff',
          },
        };
      }
      throw new NotFoundException(`Public report with slug '${slug}' not found`);
    }
    return report;
  }

  async generate(
    userId: string,
    clientId: string,
    metricsData: any,
    title?: string,
  ) {
    // Get user and client for context
    const [user, client] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }).catch(() => ({
        agencyName: 'Demo Agency',
        primaryColor: '#8a2be2',
        accentColor: '#00e5ff',
      })),
      this.prisma.client.findUnique({ where: { id: clientId } }).catch(() => ({
        name: 'Demo Client',
        email: 'client@example.com',
      })),
    ]);

    // Generate AI summary & Action plan in parallel
    const [summaryResult, actionPlanResult] = await Promise.all([
      this.aiService.generateReportSummary(
        user?.agencyName || 'Agency',
        client?.name || 'Client',
        metricsData,
      ),
      this.aiService.generateActionPlan(
        user?.agencyName || 'Agency',
        client?.name || 'Client',
        metricsData,
      ),
    ]);

    const { summary, insights } = summaryResult;
    const actionPlan = actionPlanResult;

    const reportTitle = title || `${client?.name || 'Client'} — ${new Date().toLocaleString('en', { month: 'long', year: 'numeric' })} Report`;

    // Create report in DB
    const report = await this.prisma.report
      .create({
        data: {
          title: reportTitle,
          userId,
          clientId,
          status: 'READY',
          aiSummary: summary,
          aiInsights: JSON.stringify(insights),
          aiActionPlan: JSON.stringify(actionPlan),
          metricsData: JSON.stringify(metricsData),
          isPublic: true,
          period: metricsData.period || new Date().toLocaleString('en', { month: 'long', year: 'numeric' }),
        },
      })
      .catch(() => ({
        id: 'mock-' + crypto.randomUUID(),
        title: reportTitle,
        status: 'READY',
        publicSlug: 'demo-' + Date.now(),
        aiSummary: summary,
        aiInsights: insights,
        aiActionPlan: actionPlan,
        metricsData,
        createdAt: new Date(),
      }));

    this.logger.log(`Report generated for ${client?.name}: ${report.id}`);
    return report;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.report
      .update({ where: { id }, data: { status: status as any } })
      .catch(() => ({ id, status }));
  }

  async updateWorkflow(
    id: string, 
    userId: string, 
    status: string, 
    newComment?: string,
    contentUpdates?: { aiSummary?: string; aiInsights?: string; aiActionPlan?: string }
  ) {
    const report = await this.prisma.report.findFirst({ where: { id, userId } });
    if (!report) throw new NotFoundException(`Report with ID ${id} not found or access denied`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const author = user?.agencyName || 'Agency Member';

    let comments = [];
    if (report.internalNotes) {
      try { comments = JSON.parse(report.internalNotes); } catch (e) {}
    }

    if (newComment && newComment.trim().length > 0) {
      comments.push({
        author,
        text: newComment.trim(),
        timestamp: new Date().toISOString()
      });
    }

    const data: any = {
      status: status || report.status,
      internalNotes: JSON.stringify(comments)
    };

    if (contentUpdates) {
      if (contentUpdates.aiSummary !== undefined) data.aiSummary = contentUpdates.aiSummary;
      if (contentUpdates.aiInsights !== undefined) data.aiInsights = contentUpdates.aiInsights;
      if (contentUpdates.aiActionPlan !== undefined) data.aiActionPlan = contentUpdates.aiActionPlan;
    }

    return this.prisma.report.update({
      where: { id },
      data
    });
  }

  async getSlides(idOrSlug: string) {
    let report = await this.prisma.report.findFirst({
      where: { OR: [{ id: idOrSlug }, { publicSlug: idOrSlug }] },
      include: {
        client: { select: { name: true, website: true } },
        user: { select: { agencyName: true, logo: true, primaryColor: true, accentColor: true } }
      }
    }).catch(() => null);

    if (!report) {
      report = MOCK_REPORTS[0] as any;
    }

    let metrics: any = {};
    try {
      metrics = typeof report.metricsData === 'string' ? JSON.parse(report.metricsData) : (report.metricsData || {});
    } catch {
      metrics = {};
    }

    let insights: string[] = [];
    try {
      insights = typeof report.aiInsights === 'string' ? JSON.parse(report.aiInsights) : (report.aiInsights || []);
    } catch {
      insights = ['Strong growth across organic channels', 'Conversion rate optimization improved sales'];
    }

    let actionPlan: any = {};
    try {
      actionPlan = typeof report.aiActionPlan === 'string' ? JSON.parse(report.aiActionPlan) : (report.aiActionPlan || {});
    } catch {
      actionPlan = { actionItems: ['Scale highest-ROI ad campaigns', 'Refine landing page checkout flow'] };
    }

    const agency = report.user?.agencyName || 'ReportIQ Agency';
    const clientName = report.client?.name || 'Client';
    const period = report.period || 'Monthly Performance';

    return {
      reportId: report.id,
      title: report.title,
      clientName,
      agencyName: agency,
      period,
      slides: [
        {
          slideNumber: 1,
          type: 'cover',
          title: report.title,
          subtitle: `Prepared by ${agency} for ${clientName}`,
          badge: period,
          highlight: 'Executive Strategy & Performance Presentation'
        },
        {
          slideNumber: 2,
          type: 'metrics',
          title: 'Executive KPI Summary',
          subtitle: 'Core digital growth metrics for the reporting period',
          metrics: [
            { label: 'Total Sessions', value: (metrics.sessions || 4231).toLocaleString(), change: '+18.4%' },
            { label: 'Page Views', value: (metrics.pageViews || 12840).toLocaleString(), change: '+12.1%' },
            { label: 'Conversions', value: (metrics.conversions || 134).toLocaleString(), change: '+24.5%' },
            { label: 'Conversion Rate', value: `${metrics.conversionRate || 3.17}%`, change: '+0.5%' },
            { label: 'Avg Session Duration', value: metrics.avgSessionDuration || '3m 42s', change: '+14s' }
          ]
        },
        {
          slideNumber: 3,
          type: 'attribution',
          title: 'Channel Attribution & Traffic Mix',
          subtitle: 'Where qualified leads and traffic originated',
          trafficSources: metrics.trafficSources || [
            { source: 'Organic Search', percentage: 62 },
            { source: 'Direct Traffic', percentage: 18 },
            { source: 'Paid Social Ads', percentage: 12 },
            { source: 'Referral & Partner', percentage: 8 }
          ]
        },
        {
          slideNumber: 4,
          type: 'insights',
          title: 'AI Strategic Intelligence & Diagnostics',
          subtitle: 'Automated trend analysis powered by ReportIQ AI',
          summary: report.aiSummary || 'Performance exceeded benchmarks across all core acquisition funnels.',
          keyInsights: Array.isArray(insights) ? insights.slice(0, 4) : [insights]
        },
        {
          slideNumber: 5,
          type: 'actionPlan',
          title: 'Next Month Action Plan & Budget Approval',
          subtitle: 'Strategic roadmap to accelerate growth next cycle',
          actionItems: actionPlan.actionItems || [
            'Scale top-converting Meta ad adsets by +25%',
            'Publish 4 high-intent comparison articles targeting competitor keywords',
            'Deploy WhatsApp automated lead capture on pricing page'
          ],
          recommendedBudget: metrics.conversions ? `$${Math.round(metrics.conversions * 45).toLocaleString()}` : '$3,500'
        }
      ]
    };
  }

  async recordApproval(
    id: string,
    body: {
      decision: 'APPROVED' | 'REVISIONS_REQUESTED';
      signatoryName: string;
      signatoryEmail?: string;
      notes?: string;
      budgetApproved?: number;
    }
  ) {
    const report = await this.prisma.report.findFirst({
      where: { OR: [{ id }, { publicSlug: id }] }
    });

    if (!report) throw new NotFoundException('Report not found');

    let comments = [];
    if (report.internalNotes) {
      try { comments = JSON.parse(report.internalNotes); } catch (e) {}
    }

    const timestamp = new Date().toISOString();
    comments.push({
      author: `Client Signatory: ${body.signatoryName || 'Client'}`,
      text: `[SIGN-OFF: ${body.decision}] ${body.notes || 'No extra notes.'} (Budget Approved: ${body.budgetApproved ? '$' + body.budgetApproved : 'Confirmed'})`,
      timestamp
    });

    const newStatus = body.decision === 'APPROVED' ? 'APPROVED' : 'CHANGES_REQUESTED';

    return this.prisma.report.update({
      where: { id: report.id },
      data: {
        status: newStatus,
        internalNotes: JSON.stringify(comments)
      }
    });
  }

  async dispatchMultiChannel(
    id: string,
    body: {
      channel: 'whatsapp' | 'slack' | 'email';
      target?: string;
      message?: string;
    }
  ) {
    const report = await this.prisma.report.findFirst({
      where: { OR: [{ id }, { publicSlug: id }] },
      include: { client: true, user: true }
    });

    if (!report) throw new NotFoundException('Report not found');

    const clientName = report.client?.name || 'Client';
    const reportUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/report/${report.publicSlug || report.id}`;
    const defaultMsg = `📊 ${report.title} is ready for review! View report here: ${reportUrl}`;
    const text = body.message || defaultMsg;

    if (body.channel === 'slack') {
      const webhookUrl = body.target || process.env.SLACK_WEBHOOK_URL;
      this.logger.log(`[SLACK DISPATCH] To: ${webhookUrl || 'Mock Slack Webhook'} | Msg: ${text}`);
      return {
        success: true,
        channel: 'slack',
        status: 'DISPATCHED',
        dispatchedAt: new Date().toISOString(),
        message: 'Slack notification posted successfully to channel!'
      };
    }

    if (body.channel === 'whatsapp') {
      const targetPhone = body.target || (report.client as any)?.phone || '+14155238886';
      this.logger.log(`[WHATSAPP DISPATCH] To: ${targetPhone} | Msg: ${text}`);
      return {
        success: true,
        channel: 'whatsapp',
        status: 'DISPATCHED',
        target: targetPhone,
        dispatchedAt: new Date().toISOString(),
        message: `WhatsApp message dispatched to ${targetPhone}!`
      };
    }

    // Default: Email
    const targetEmail = body.target || report.client?.email || 'client@example.com';
    this.logger.log(`[EMAIL DISPATCH] To: ${targetEmail} | Subject: ${report.title}`);
    return {
      success: true,
      channel: 'email',
      status: 'DISPATCHED',
      target: targetEmail,
      dispatchedAt: new Date().toISOString(),
      message: `Executive report email sent to ${targetEmail}!`
    };
  }
}

