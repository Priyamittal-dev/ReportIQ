import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ReportsModule } from '../reports/reports.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ReportsModule, EmailModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
