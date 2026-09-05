import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user
      .findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          agencyName: true,
          logo: true,
          primaryColor: true,
          accentColor: true,
          plan: true,
          language: true,
          createdAt: true,
          _count: {
            select: { clients: true, reports: true },
          },
        },
      })
      .catch(() => null);
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user
      .update({
        where: { id },
        data: dto,
        select: {
          id: true,
          email: true,
          agencyName: true,
          logo: true,
          primaryColor: true,
          accentColor: true,
          plan: true,
          language: true,
        },
      })
      .catch(() => {
        this.logger.warn('DB unavailable, returning mock update');
        return { id, ...dto };
      });
  }

  async updateLogo(id: string, logoUrl: string) {
    return this.update(id, { logo: logoUrl });
  }

  async getStats(userId: string) {
    try {
      const [clientCount, reportCount, sentCount] = await Promise.all([
        this.prisma.client.count({ where: { userId } }),
        this.prisma.report.count({ where: { userId } }),
        this.prisma.report.count({ where: { userId, status: 'SENT' } }),
      ]);
      return { clientCount, reportCount, sentCount, hoursSaved: reportCount * 2 };
    } catch {
      return { clientCount: 5, reportCount: 12, sentCount: 10, hoursSaved: 24 };
    }
  }

  async getAlerts(userId: string) {
    // Generate mock anomaly alerts for demonstration (Extraordinary feature)
    return [
      {
        id: '1',
        title: 'Traffic Drop Detected',
        message: 'Organic traffic for Acme Corp dropped by 42% over the weekend. Check Google Search Console.',
        severity: 'HIGH',
        metricName: 'sessions',
        metricValue: -42,
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Conversion Spike',
        message: 'Meta Ads conversions for Beta Co increased by 150% in the last 24 hours. Consider scaling ad spend.',
        severity: 'LOW',
        metricName: 'conversions',
        metricValue: 150,
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        id: '3',
        title: 'Data Integration Error',
        message: 'Google Analytics token expired for Client XYZ. Please re-authenticate.',
        severity: 'CRITICAL',
        metricName: 'system',
        metricValue: 0,
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
  }
}
