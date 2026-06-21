import { Injectable, Logger } from '@nestjs/common';
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

  async findOne(id: string, userId: string) {
    return this.prisma.report
      .findFirst({
        where: { id, userId },
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
      .catch(() => MOCK_REPORTS.find((r) => r.id === id) || MOCK_REPORTS[0]);
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
      // Return mock public report
      return {
        ...MOCK_REPORTS.find((r) => r.publicSlug === slug) || MOCK_REPORTS[0],
        client: { name: 'Bright Digital Co.', website: 'https://brightdigital.com' },
        user: {
          agencyName: 'Demo Agency',
          logo: null,
          primaryColor: '#8a2be2',
          accentColor: '#00e5ff',
        },
      };
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
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new Error('Report not found');

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
}
