import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';

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
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    }).catch(() => null);

    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = uuidv4();

    const user = await this.prisma.user.create({
      data: { 
        email: dto.email, 
        passwordHash, 
        agencyName: dto.agencyName,
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
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
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

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } }).catch(() => null);
  }
}
