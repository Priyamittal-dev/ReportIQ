import { Controller, Get, Post, Body, Param, UseGuards, Req, Put, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { PdfService } from './pdf.service';
import { AgencyGuard } from '../common/guards/agency.guard';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private pdfService: PdfService,
  ) {}

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get public shareable report by slug (Spotlight API)' })
  findPublic(@Param('slug') slug: string) {
    return this.reportsService.findPublic(slug);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'List all reports for agency or client' })
  findAll(@Req() req: any) {
    if (req.user?.isClient) {
      return this.reportsService.findAllForClient(req.user.id);
    }
    return this.reportsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a specific report' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.reportsService.findOne(id, req.user.id, !!req.user?.isClient);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Download or view report PDF' })
  async downloadPdf(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    let report = await this.reportsService.findPublic(id).catch(() => null);
    if (!report && req.user?.id) {
      report = await this.reportsService.findOne(id, req.user.id, !!req.user?.isClient).catch(() => null);
    }
    if (!report) {
      report = await this.reportsService.findOne(id, 'demo').catch(() => null);
    }

    if (!report) {
      return res.status(404).json({ message: `Report ${id} not found` });
    }

    const html = this.pdfService.generateReportHtml(report);
    const buffer = await this.pdfService.generatePdfFromHtml(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="report-${id}.pdf"`);
    return res.send(buffer);
  }

  @Put(':id/workflow')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AgencyGuard)
  @ApiOperation({ summary: 'Update report workflow status, comments, and content' })
  updateWorkflow(
    @Param('id') id: string,
    @Body() body: { status: string; newComment?: string; aiSummary?: string; aiInsights?: string; aiActionPlan?: string },
    @Req() req: any,
  ) {
    return this.reportsService.updateWorkflow(id, req.user.id, body.status, body.newComment, {
      aiSummary: body.aiSummary,
      aiInsights: body.aiInsights,
      aiActionPlan: body.aiActionPlan
    });
  }

  @Post('generate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AgencyGuard)
  @ApiOperation({ summary: 'Generate AI-powered report for a client' })
  generate(
    @Body()
    body: {
      clientId?: string;
      clientName?: string;
      metricsData?: any;
      dateRange?: string;
      sections?: string[];
      title?: string;
    },
    @Req() req: any,
  ) {
    const metricsData = body.metricsData || {
      sessions: Math.floor(Math.random() * 5000) + 1000,
      pageViews: Math.floor(Math.random() * 15000) + 3000,
      conversions: Math.floor(Math.random() * 200) + 50,
      conversionRate: +(Math.random() * 3 + 1.5).toFixed(2),
      bounceRate: +(Math.random() * 20 + 30).toFixed(1),
      avgSessionDuration: `${Math.floor(Math.random() * 4) + 1}m ${Math.floor(Math.random() * 50) + 10}s`,
      period: body.dateRange || 'This Month',
      trafficSources: [
        { source: 'Organic Search', percentage: 55 },
        { source: 'Direct', percentage: 20 },
        { source: 'Social', percentage: 15 },
        { source: 'Referral', percentage: 10 },
      ],
    };

    return this.reportsService.generate(
      req.user.id,
      body.clientId || 'demo-client',
      metricsData,
      body.title || (body.clientName ? `${body.clientName} — Report` : undefined),
    );
  }
}

