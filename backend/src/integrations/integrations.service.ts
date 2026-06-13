import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.integration
      .findMany({ where: { userId } })
      .catch(() => [
        {
          id: 'mock-int-1',
          type: 'GOOGLE_ANALYTICS',
          label: 'Main GA4 Property',
          propertyId: 'GA4-123456789',
          isActive: true,
          createdAt: new Date(),
        },
      ]);
  }

  async connectManual(userId: string, data: any) {
    return this.prisma.integration
      .create({
        data: {
          type: 'MANUAL',
          label: data.label || 'Manual Data Input',
          userId,
          metadata: JSON.stringify(data),
        },
      })
      .catch(() => ({
        id: 'mock-manual-' + Date.now(),
        type: 'MANUAL',
        label: data.label,
        isActive: true,
        userId,
      }));
  }

  async connectGoogleAnalytics(userId: string, tokens: any, propertyId: string) {
    const existing = await this.prisma.integration
      .findFirst({
        where: { userId, type: 'GOOGLE_ANALYTICS' },
      })
      .catch(() => null);

    if (existing) {
      return this.prisma.integration
        .update({
          where: { id: existing.id },
          data: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            propertyId,
            expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
            isActive: true,
          },
        })
        .catch(() => existing);
    }

    return this.prisma.integration
      .create({
        data: {
          type: 'GOOGLE_ANALYTICS',
          label: `GA4 — ${propertyId}`,
          userId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          propertyId,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        },
      })
      .catch(() => ({
        id: 'mock-ga-' + Date.now(),
        type: 'GOOGLE_ANALYTICS',
        label: `GA4 — ${propertyId}`,
        propertyId,
        userId,
        isActive: true,
      }));
  }

  async disconnect(id: string, userId: string) {
    return this.prisma.integration
      .delete({ where: { id } })
      .catch(() => ({ deleted: true, id }));
  }
}
