import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiProperty, ApiParam } from '@nestjs/swagger';
import { SpotlightService } from './spotlight.service';

// --- Swagger DTOs for Documentation ---
class SpotlightReportResponse {
  @ApiProperty({ example: 'clq1234abcd', description: 'The unique ID of the report' })
  id: string;

  @ApiProperty({ example: 'Q3 Digital Marketing Performance', description: 'Title of the report' })
  title: string;

  @ApiProperty({ example: 'my-agency-q3-marketing-2023', description: 'URL-friendly slug for public access' })
  slug: string;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: { name: 'Acme Corp', website: 'acme.com' }, description: 'Client details (safe public view)' })
  client: any;
}

class SpotlightAgencyResponse {
  @ApiProperty({ example: 'TechFlow Agency', description: 'Agency Name' })
  agencyName: string;

  @ApiProperty({ example: 42, description: 'Number of public reports indexed' })
  publicReportCount: number;
}

class SpotlightSearchResponse {
  @ApiProperty({ type: [SpotlightReportResponse], description: 'List of matching reports' })
  reports: SpotlightReportResponse[];

  @ApiProperty({ type: [SpotlightAgencyResponse], description: 'List of matching agencies' })
  agencies: SpotlightAgencyResponse[];
}

@ApiTags('Spotlight')
@Controller('spotlight')
export class SpotlightController {
  constructor(private spotlightService: SpotlightService) {}

  @Get('reports')
  @ApiOperation({ 
    summary: 'Get publicly indexed reports (Spotlight API)',
    description: 'Retrieves a paginated list of all reports that have been marked as public. Ideal for showcasing top-performing agency reports in a public directory.'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'List of public reports retrieved successfully.', type: [SpotlightReportResponse] })
  getReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.spotlightService.getPublicReports(+page, +limit);
  }

  @Get('reports/:slug')
  @ApiOperation({ 
    summary: 'Get a single public report by slug (Spotlight API)',
    description: 'Retrieves the full details of a specific public report using its unique slug. This is the endpoint used by the public-facing client portal.'
  })
  @ApiParam({ name: 'slug', type: String, example: 'monthly-seo-acme-corp', description: 'The unique URL slug of the report' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully.', type: SpotlightReportResponse })
  @ApiResponse({ status: 404, description: 'Report not found or not marked as public.' })
  getReport(@Param('slug') slug: string) {
    return this.spotlightService.getPublicReport(slug);
  }

  @Get('agencies')
  @ApiOperation({ 
    summary: 'Get public agency profiles (Spotlight API)',
    description: 'Retrieves a list of agencies that have opted into the public directory, along with their aggregate public report counts.'
  })
  @ApiResponse({ status: 200, description: 'List of public agencies retrieved successfully.', type: [SpotlightAgencyResponse] })
  getAgencies() {
    return this.spotlightService.getPublicAgencies();
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Search across public reports and agencies (Spotlight API)',
    description: 'Performs a global text search across public report titles, client names, and agency names. Used by the global Spotlight search bar.'
  })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'SEO Performance', description: 'The search query string' })
  @ApiResponse({ status: 200, description: 'Search results matching the query.', type: SpotlightSearchResponse })
  search(@Query('q') q: string) {
    return this.spotlightService.search(q);
  }
}
