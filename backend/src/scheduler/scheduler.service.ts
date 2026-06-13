import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from '../reports/reports.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private reportsService: ReportsService,
    private emailService: EmailService,
  ) {}

  // Check for due reports every hour
  @Cron(CronExpression.EVERY_HOUR)
  async processDueSchedules() {
    this.logger.log('⏰ Checking for due report schedules...');
    
    try {
      const now = new Date();
      const dueSchedules = await this.prisma.reportSchedule.findMany({
        where: {
          isActive: true,
          nextRunAt: { lte: now },
        },
      });

      this.logger.log(`Found ${dueSchedules.length} due schedule(s)`);

      for (const schedule of dueSchedules) {
        await this.processSchedule(schedule);
      }
    } catch (error) {
      this.logger.warn('Scheduler check failed (DB may be down): ' + error.message);
    }
  }

  private async processSchedule(schedule: any) {
    try {
      const [user, client] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: schedule.userId } }),
        this.prisma.client.findUnique({ where: { id: schedule.clientId } }),
      ]);

      if (!user || !client) return;

      // Generate report with mock metrics (real implementation would pull from GA)
      const mockMetrics = {
        sessions: Math.floor(Math.random() * 5000) + 2000,
        pageViews: Math.floor(Math.random() * 15000) + 5000,
        conversions: Math.floor(Math.random() * 200) + 50,
        conversionRate: parseFloat((Math.random() * 3 + 1).toFixed(2)),
        bounceRate: parseFloat((Math.random() * 20 + 30).toFixed(1)),
        period: new Date().toLocaleString('en', { month: 'long', year: 'numeric' }),
      };

      const report = await this.reportsService.generate(
        schedule.userId,
        schedule.clientId,
        mockMetrics,
      );

      // Send email
      await this.emailService.sendReport({
        toEmail: client.email,
        toName: client.name,
        agencyName: user.agencyName,
        agencyLogo: user.logo ?? undefined,
        agencyColor: user.primaryColor ?? undefined,
        reportTitle: report.title,
        reportSlug: report.publicSlug,
        aiSummary: report.aiSummary ?? '',
      });

      // Update next run time
      const nextRun = this.getNextRunTime(schedule);
      await this.prisma.reportSchedule.update({
        where: { id: schedule.id },
        data: { lastRunAt: new Date(), nextRunAt: nextRun },
      });

      this.logger.log(`✅ Auto-report sent to ${client.email}`);
    } catch (error) {
      this.logger.error(`Schedule ${schedule.id} failed: ${error.message}`);
    }
  }

  private getNextRunTime(schedule: any): Date {
    const next = new Date();
    if (schedule.frequency === 'WEEKLY') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    next.setHours(schedule.hour, 0, 0, 0);
    return next;
  }

  // Daily cleanup at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldDraftReports() {
    this.logger.log('🧹 Cleaning up old draft reports...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await this.prisma.report.deleteMany({
        where: { status: 'DRAFT', createdAt: { lt: thirtyDaysAgo } },
      });
      
      if (result.count > 0) {
        this.logger.log(`Deleted ${result.count} old draft report(s)`);
      }
    } catch (error) {
      this.logger.warn('Cleanup skipped: ' + error.message);
    }
  }
}
