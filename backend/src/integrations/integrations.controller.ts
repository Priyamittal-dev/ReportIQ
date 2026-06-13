import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IntegrationsService } from './integrations.service';

@ApiTags('Integrations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('integrations')
export class IntegrationsController {
  constructor(private integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all connected integrations' })
  findAll(@Req() req: any) {
    return this.integrationsService.findAll(req.user.id);
  }

  @Post('manual')
  @ApiOperation({ summary: 'Add manual data input integration' })
  connectManual(@Body() body: any, @Req() req: any) {
    return this.integrationsService.connectManual(req.user.id, body);
  }

  @Post('google-analytics')
  @ApiOperation({ summary: 'Connect Google Analytics OAuth integration' })
  connectGA(@Body() body: { tokens: any; propertyId: string }, @Req() req: any) {
    return this.integrationsService.connectGoogleAnalytics(
      req.user.id,
      body.tokens,
      body.propertyId,
    );
  }

  @Get('google-ads/auth')
  @ApiOperation({ summary: 'Get Google Ads OAuth URL' })
  getGoogleAdsAuthUrl() {
    // In a real app, this generates the Google OAuth URL with proper scopes
    return { url: 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/adwords&response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT' };
  }

  @Get('meta-ads/auth')
  @ApiOperation({ summary: 'Get Meta Ads OAuth URL' })
  getMetaAdsAuthUrl() {
    // In a real app, this generates the Facebook/Meta OAuth URL
    return { url: 'https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT&scope=ads_read' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Disconnect an integration' })
  disconnect(@Param('id') id: string, @Req() req: any) {
    return this.integrationsService.disconnect(id, req.user.id);
  }
}
