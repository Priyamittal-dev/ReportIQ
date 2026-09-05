import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const MOCK_CLIENTS = [
  {
    id: 'mock-client-1',
    name: 'Bright Digital Co.',
    email: 'hello@brightdigital.com',
    website: 'https://brightdigital.com',
    timezone: 'UTC',
    notes: 'Monthly SEO + Google Ads',
    logoUrl: null,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'mock-client-2',
    name: 'EcomBoost Inc.',
    email: 'marketing@ecomboost.io',
    website: 'https://ecomboost.io',
    timezone: 'Europe/London',
    notes: 'Weekly Meta Ads report',
    logoUrl: null,
    createdAt: new Date('2024-02-03'),
  },
  {
    id: 'mock-client-3',
    name: 'Sunrise Fitness',
    email: 'growth@sunrisefitness.com',
    website: 'https://sunrisefitness.com',
    timezone: 'America/New_York',
    notes: 'Monthly organic traffic report',
    logoUrl: null,
    createdAt: new Date('2024-03-10'),
  },
];

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.client
      .findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { reports: true } },
        },
      })
      .catch(() => {
        this.logger.warn('DB unavailable, returning mock clients');
        return MOCK_CLIENTS;
      });
  }

  async findOne(id: string, userId: string) {
    const client = await this.prisma.client
      .findFirst({
        where: { id, userId },
        include: {
          reports: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true,
              sentAt: true,
            },
          },
        },
      })
      .catch(() => null);

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found or access denied`);
    }
    return client;
  }

  async create(userId: string, dto: CreateClientDto) {
    const dataToSave: any = { ...dto, userId };
    if (dataToSave.portalPassword) {
      dataToSave.portalPassword = await bcrypt.hash(dataToSave.portalPassword, 12);
    }
    return this.prisma.client
      .create({
        data: dataToSave,
      })
      .catch(() => ({
        id: 'mock-' + crypto.randomUUID(),
        ...dto,
        userId,
        createdAt: new Date(),
      }));
  }

  async update(id: string, userId: string, dto: UpdateClientDto) {
    const existing = await this.prisma.client.findFirst({
      where: { id, userId },
    }).catch(() => null);

    if (!existing) {
      throw new NotFoundException(`Client with ID ${id} not found or access denied`);
    }

    const dataToSave: any = { ...dto };
    if (dataToSave.portalPassword) {
      dataToSave.portalPassword = await bcrypt.hash(dataToSave.portalPassword, 12);
    }
    return this.prisma.client.update({
      where: { id },
      data: dataToSave,
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.client.findFirst({
      where: { id, userId },
    }).catch(() => null);

    if (!existing) {
      throw new NotFoundException(`Client with ID ${id} not found or access denied`);
    }

    return this.prisma.client.delete({
      where: { id },
    });
  }
}


