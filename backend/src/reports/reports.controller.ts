import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get public shareable report by slug (Spotlight API)' })
  findPublic(@Param('slug') slug: string) {
    return this.reportsService.findPublic(slug);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'List all reports for agency' })
  findAll(@Req() req: any) {
    return this.reportsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a specific report' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.reportsService.findOne(id, req.user.id);
  }

  @Post('generate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Generate AI-powered report for a client' })
  generate(
    @Body()
    body: {
      clientId: string;
      metricsData: any;
      title?: string;
    },
    @Req() req: any,
  ) {
    return this.reportsService.generate(
      req.user.id,
      body.clientId,
      body.metricsData,
      body.title,
    );
  }
}
