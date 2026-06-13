import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('audit-logs')
// @UseGuards(AuthGuard('jwt')) // Temporarily disabled for ease of testing
export class AuditLogsController {
  
  @Get()
  getLogs() {
    // Return mock audit logs since we don't have a database table for it yet
    return [
      { id: '1', action: 'USER_LOGIN', user: 'Rahul Garg', ip: '192.168.1.1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: 'SUCCESS' },
      { id: '2', action: 'REPORT_GENERATED', user: 'System', target: 'Client A', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), status: 'SUCCESS' },
      { id: '3', action: 'BILLING_UPDATED', user: 'Rahul Garg', plan: 'Enterprise', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: 'SUCCESS' },
      { id: '4', action: 'FAILED_LOGIN', user: 'Unknown', ip: '203.0.113.42', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), status: 'FAILURE' },
      { id: '5', action: 'API_KEY_CREATED', user: 'Rahul Garg', target: 'Zapier Integration', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), status: 'SUCCESS' },
    ];
  }
}
