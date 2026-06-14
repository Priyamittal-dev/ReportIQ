import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ReportsModule } from './reports/reports.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { AiModule } from './ai/ai.module';
import { EmailModule } from './email/email.module';
import { SpotlightModule } from './spotlight/spotlight.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminModule } from './admin/admin.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ReportsModule,
    IntegrationsModule,
    AiModule,
    EmailModule,
    SpotlightModule,
    SchedulerModule,
    AdminModule,
    AuditLogsModule,
    ScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
