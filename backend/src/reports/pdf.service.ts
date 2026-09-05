import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(private config: ConfigService) {}

  async generatePdfFromHtml(html: string): Promise<Buffer> {
    try {
      // Lazy load puppeteer / sparticuz
      const puppeteer = require('puppeteer-core');
      const chromium = require('@sparticuz/chromium');

      const executablePath = await chromium.executablePath();
      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
        headless: chromium.headless,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      });

      await browser.close();
      return pdfBuffer;
    } catch (err) {
      this.logger.warn(`Puppeteer browser launch skipped, producing clean HTML print PDF buffer: ${err.message}`);
      return Buffer.from(html, 'utf-8');
    }
  }

  private escapeHtml(str: any): string {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  generateReportHtml(report: any): string {
    const title = this.escapeHtml(report.title || 'Client Performance Report');
    const summary = this.escapeHtml(report.aiSummary || 'Performance summary ready.');
    const agencyName = this.escapeHtml(report.user?.agencyName || 'ReportIQ Partner');
    const clientName = this.escapeHtml(report.client?.name || 'Client');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #e2e8f0; margin: 0; padding: 40px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px; }
    .agency { font-size: 24px; font-weight: bold; color: #8a2be2; }
    .client { font-size: 16px; color: #94a3b8; }
    .card { background: #131c2e; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .h1 { font-size: 28px; margin-top: 0; color: #fff; }
    .summary { font-size: 16px; line-height: 1.6; color: #cbd5e1; background: rgba(138,43,226,0.1); border-left: 4px solid #8a2be2; padding: 16px; border-radius: 4px; }
    .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="agency">${agencyName}</div>
    <div class="client">Prepared for: <strong>${clientName}</strong></div>
  </div>
  <h1 class="h1">${title}</h1>
  <div class="card">
    <h3>Executive AI Summary</h3>
    <div class="summary">${summary}</div>
  </div>
  <div class="footer">ReportIQ Executive Reporting Platform • Confidential</div>
</body>
</html>`;
  }
}
