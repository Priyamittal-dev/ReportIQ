import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IntegrationsService } from './integrations.service';
import { AgencyGuard } from '../common/guards/agency.guard';

@ApiTags('Integrations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AgencyGuard)
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
  getGoogleAdsAuthUrl(@Req() req: any) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.FRONTEND_URL}/dashboard/integrations/callback/google`;
    const scope = encodeURIComponent('https://www.googleapis.com/auth/adwords');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&access_type=offline&prompt=consent`;
    return { url };
  }

  @Post('google-ads/callback')
  @ApiOperation({ summary: 'Handle Google Ads OAuth callback' })
  handleGoogleAdsCallback(@Body() body: { code: string }, @Req() req: any) {
    return this.integrationsService.exchangeGoogleCode(req.user.id, body.code);
  }

  @Get('meta-ads/auth')
  @ApiOperation({ summary: 'Get Meta Ads OAuth URL' })
  getMetaAdsAuthUrl(@Req() req: any) {
    const clientId = process.env.META_CLIENT_ID;
    const redirectUri = `${process.env.FRONTEND_URL}/dashboard/integrations/callback/meta`;
    const scope = 'ads_read,read_insights';
    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    return { url };
  }

  @Post('meta-ads/callback')
  @ApiOperation({ summary: 'Handle Meta Ads OAuth callback' })
  handleMetaAdsCallback(@Body() body: { code: string }, @Req() req: any) {
    return this.integrationsService.exchangeMetaCode(req.user.id, body.code);
  }

  @Post('shopify')
  @ApiOperation({ summary: 'Connect Shopify e-commerce store' })
  connectShopify(@Body() body: { shopDomain: string; accessToken: string }, @Req() req: any) {
    return this.integrationsService.connectShopify(req.user.id, body.shopDomain, body.accessToken);
  }

  @Post('linkedin-ads')
  @ApiOperation({ summary: 'Connect LinkedIn Ads account' })
  connectLinkedIn(@Body() body: { accountId: string; accessToken?: string }, @Req() req: any) {
    return this.integrationsService.connectLinkedIn(req.user.id, body.accountId, body.accessToken);
  }

  @Post('slack')
  @ApiOperation({ summary: 'Connect Slack Incoming Webhook for agency alerts' })
  connectSlack(@Body() body: { webhookUrl: string; channelName?: string }, @Req() req: any) {
    return this.integrationsService.connectSlack(req.user.id, body.webhookUrl, body.channelName);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Disconnect an integration' })
  disconnect(@Param('id') id: string, @Req() req: any) {
    return this.integrationsService.disconnect(id, req.user.id);
  }
}
