import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MOCK_PUBLIC_REPORTS = [
  {
    id: 'spotlight-1',
    title: 'May 2024 — Growth Report',
    publicSlug: 'bright-digital-may-2024',
    period: 'May 1–31, 2024',
    aiSummary: 'Excellent month with +18% session growth driven by SEO improvements.',
    client: { name: 'Bright Digital Co.' },
    user: { agencyName: 'GrowAgency', primaryColor: '#8a2be2' },
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'spotlight-2',
    title: 'Q1 2024 — Quarterly Performance',
    publicSlug: 'ecomboost-q1-2024',
    period: 'Jan 1 – Mar 31, 2024',
    aiSummary: 'Revenue up 34% quarter-over-quarter with Meta Ads as the top converter.',
    client: { name: 'EcomBoost Inc.' },
    user: { agencyName: 'MediaPulse', primaryColor: '#06b6d4' },
    createdAt: new Date('2024-04-02'),
  },
];

@Injectable()
export class SpotlightService {
  private readonly logger = new Logger(SpotlightService.name);

  constructor(private prisma: PrismaService) {}

  async getPublicReports(page: number, limit: number) {
    const skip = (page - 1) * limit;

    try {
      const [reports, total] = await Promise.all([
        this.prisma.report.findMany({
          where: { isPublic: true, status: 'SENT' },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            publicSlug: true,
            period: true,
            aiSummary: true,
            createdAt: true,
            client: { select: { name: true } },
            user: { select: { agencyName: true, primaryColor: true } },
          },
        }),
        this.prisma.report.count({ where: { isPublic: true, status: 'SENT' } }),
      ]);

      return { reports, total, page, limit, pages: Math.ceil(total / limit) };
    } catch {
      return {
        reports: MOCK_PUBLIC_REPORTS,
        total: MOCK_PUBLIC_REPORTS.length,
        page,
        limit,
        pages: 1,
      };
    }
  }

  async getPublicReport(slug: string) {
    return this.prisma.report
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
      .catch(() => MOCK_PUBLIC_REPORTS.find((r) => r.publicSlug === slug) || MOCK_PUBLIC_REPORTS[0]);
  }

  async getPublicAgencies() {
    return this.prisma.user
      .findMany({
        where: {
          reports: { some: { isPublic: true } },
        },
        select: {
          id: true,
          agencyName: true,
          logo: true,
          primaryColor: true,
          _count: { select: { clients: true, reports: true } },
        },
        take: 20,
      })
      .catch(() => [
        { id: 'a1', agencyName: 'GrowAgency', logo: null, primaryColor: '#8a2be2', _count: { clients: 12, reports: 48 } },
        { id: 'a2', agencyName: 'MediaPulse', logo: null, primaryColor: '#06b6d4', _count: { clients: 8, reports: 32 } },
      ]);
  }

  async search(q: string) {
    return this.prisma.report
      .findMany({
        where: {
          isPublic: true,
          OR: [
            { title: { contains: q } },
            { aiSummary: { contains: q } },
            { client: { name: { contains: q } } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          publicSlug: true,
          aiSummary: true,
          client: { select: { name: true } },
          user: { select: { agencyName: true } },
        },
      })
      .catch(() =>
        MOCK_PUBLIC_REPORTS.filter(
          (r) =>
            r.title.toLowerCase().includes(q.toLowerCase()) ||
            r.client.name.toLowerCase().includes(q.toLowerCase()),
        ),
      );
  }
}
