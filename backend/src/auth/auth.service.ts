import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
  ) {}

  async signup(dto: SignupDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({
      where: { email },
    }).catch(() => null);

    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = crypto.randomUUID();

    const user = await this.prisma.user.create({
      data: { 
        email, 
        passwordHash, 
        agencyName: dto.agencyName.trim(),
        verificationToken,
        emailVerified: false
      },
    }).catch(() => null);

    if (!user) {
      throw new ConflictException('Could not create account');
    }

    // Send the verification email using EmailService
    await this.emailService.sendVerificationEmail(user.email, verificationToken);
    
    this.logger.log(`New agency registered, waiting for verification: ${user.email}`);
    
    return {
      message: 'Account created successfully. Please check your email to verify your account.',
      requiresVerification: true,
      user: {
        email: user.email,
        agencyName: user.agencyName,
      }
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
    }).catch(() => null);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const tokens = this.generateTokens(user.id, user.email);
    this.logger.log(`Login: ${user.email}`);
    return {
      user: {
        id: user.id,
        email: user.email,
        agencyName: user.agencyName,
        plan: user.plan,
        logo: user.logo,
        primaryColor: user.primaryColor,
        accentColor: user.accentColor,
      },
      ...tokens,
    };
  }

  async demoLogin() {
    const demoEmail = 'demo.agency@reportiq.app';
    let user: any = await this.prisma.user.findUnique({
      where: { email: demoEmail },
    }).catch(() => null);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: demoEmail,
          agencyName: 'Apex Growth Marketing (Demo)',
          plan: 'AGENCY',
          emailVerified: true,
          primaryColor: '#8a2be2',
          accentColor: '#00e5ff',
        },
      }).catch(() => null);
    }

    const effectiveUser = user || {
      id: 'demo-user-id',
      email: demoEmail,
      agencyName: 'Apex Growth Marketing (Demo)',
      plan: 'AGENCY',
      logo: null,
      primaryColor: '#8a2be2',
      accentColor: '#00e5ff',
    };

    const tokens = this.generateTokens(effectiveUser.id, effectiveUser.email);
    this.logger.log(`1-Click Demo Login: ${effectiveUser.email}`);

    return {
      user: {
        id: effectiveUser.id,
        email: effectiveUser.email,
        agencyName: effectiveUser.agencyName,
        plan: effectiveUser.plan,
        logo: effectiveUser.logo || null,
        primaryColor: effectiveUser.primaryColor || '#8a2be2',
        accentColor: effectiveUser.accentColor || '#00e5ff',
      },
      ...tokens,
    };
  }


  async googleLogin(profile: any) {

    let user = await this.prisma.user.findUnique({
      where: { googleId: profile.id },
    }).catch(() => null);

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email: profile.emails[0].value },
      }).catch(() => null);
    }

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails[0].value,
          agencyName: profile.displayName || 'My Agency',
          logo: profile.photos?.[0]?.value ?? null,
        },
      }).catch(() => null);
    }

    const effectiveUser = user ?? {
      id: 'google-' + profile.id,
      email: profile.emails[0].value,
    };

    return this.generateTokens(effectiveUser.id, effectiveUser.email);
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    }).catch(() => null);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    this.logger.log(`User email verified: ${user.email}`);

    const tokens = this.generateTokens(user.id, user.email);
    return {
      message: 'Email verified successfully.',
      user: {
        id: user.id,
        email: user.email,
        agencyName: user.agencyName,
        plan: user.plan,
        logo: user.logo,
        primaryColor: user.primaryColor,
        accentColor: user.accentColor,
      },
      ...tokens,
    };
  }

  generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
    };
  }

  generateClientTokens(clientId: string, email: string) {
    const payload = { sub: clientId, email, isClient: true };
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } }).catch(() => null);
  }

  async portalLogin(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const client = await this.prisma.client.findFirst({
      where: { email },
      include: { user: true } // Need the agency details for the portal branding
    }).catch(() => null);

    if (!client || !client.portalPassword) {
      throw new UnauthorizedException('Invalid client email or password.');
    }

    let isMatch = false;
    if (client.portalPassword.startsWith('$2a$') || client.portalPassword.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(dto.password, client.portalPassword);
    } else {
      isMatch = dto.password === client.portalPassword;
    }

    if (!isMatch) {
      throw new UnauthorizedException('Invalid client email or password.');
    }

    const tokens = this.generateClientTokens(client.id, client.email);
    this.logger.log(`Client Portal Login: ${client.email}`);
    
    return {
      user: {
        id: client.id,
        email: client.email,
        name: client.name,
        isClient: true,
        agency: {
          name: client.user?.agencyName || 'Agency',
          logo: client.user?.logo,
          primaryColor: client.user?.primaryColor || '#8a2be2',
        }
      },
      ...tokens,
    };
  }
}

