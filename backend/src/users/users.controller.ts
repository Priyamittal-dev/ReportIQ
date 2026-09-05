import { Controller, Get, Put, Body, UseGuards, Req, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get agency profile' })
  getMe(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update agency profile & branding' })
  updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get agency dashboard statistics' })
  getStats(@Req() req: any) {
    return this.usersService.getStats(req.user.id);
  }

  @Get('me/alerts')
  @ApiOperation({ summary: 'Get recent anomaly alerts' })
  getAlerts(@Req() req: any) {
    return this.usersService.getAlerts(req.user.id);
  }

  @Get('me/custom-domain')
  @ApiOperation({ summary: 'Get agency custom domain CNAME status' })
  getCustomDomain(@Req() req: any) {
    return this.usersService.getCustomDomain(req.user.id);
  }

  @Post('me/custom-domain')
  @ApiOperation({ summary: 'Save and verify agency custom domain' })
  setCustomDomain(@Req() req: any, @Body() body: { domain: string }) {
    return this.usersService.setCustomDomain(req.user.id, body.domain);
  }
}
