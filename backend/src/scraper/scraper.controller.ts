import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ScraperService } from './scraper.service';
import { AgencyGuard } from '../common/guards/agency.guard';

@ApiTags('Scraper')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AgencyGuard)
@Controller('scraper')
export class ScraperController {
  constructor(private scraperService: ScraperService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Scrape and analyze a competitor or client website' })
  analyzeUrl(@Body() body: { url: string }, @Req() req: any) {
    return this.scraperService.scrapeUrl(body.url);
  }
}
