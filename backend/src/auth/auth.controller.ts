import { Controller, Post, Body, Get, UseGuards, Req, Res, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new agency account' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login to agency account' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('portal/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Client portal login' })
  portalLogin(@Body() dto: LoginDto) {
    return this.authService.portalLogin(dto);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify email token' })
  verify(@Req() req: any) {
    const token = req.query.token;
    return this.authService.verifyEmail(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: any, @Res() res: any) {
    const tokens = await this.authService.googleLogin(req.user);
    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
    res.redirect(
      `${frontendUrl}/auth/callback?token=${tokens.accessToken}`,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async me(@Req() req: any) {
    return req.user;
  }
}
