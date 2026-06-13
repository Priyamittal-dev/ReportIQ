import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalAgencies = await this.prisma.user.count({ where: { plan: 'AGENCY' } });
    const totalClients = await this.prisma.client.count();

    return {
      stats: [
        { title: 'Total Users', value: totalUsers.toString() },
        { title: 'Active Subscriptions', value: (totalUsers - 1).toString() }, // Exclude admin
        { title: 'MRR', value: `$${totalAgencies * 79 + (totalUsers - totalAgencies - 1) * 29}` },
      ],
      recentUsers: await this.prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, agencyName: true, plan: true, createdAt: true },
      })
    };
  }
}
