import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SpotlightService } from './spotlight.service';

@ApiTags('Spotlight')
@Controller('spotlight')
export class SpotlightController {
  constructor(private spotlightService: SpotlightService) {}

  @Get('reports')
  @ApiOperation({ summary: 'Get publicly indexed reports (Spotlight API)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.spotlightService.getPublicReports(+page, +limit);
  }

  @Get('reports/:slug')
  @ApiOperation({ summary: 'Get a single public report by slug (Spotlight API)' })
  getReport(@Param('slug') slug: string) {
    return this.spotlightService.getPublicReport(slug);
  }

  @Get('agencies')
  @ApiOperation({ summary: 'Get public agency profiles (Spotlight API)' })
  getAgencies() {
    return this.spotlightService.getPublicAgencies();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search across public reports (Spotlight API)' })
  @ApiQuery({ name: 'q', required: true, type: String })
  search(@Query('q') q: string) {
    return this.spotlightService.search(q);
  }
}
