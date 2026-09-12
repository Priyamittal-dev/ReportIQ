import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

jest.mock('bcrypt');
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn().mockReturnValue('mock-uuid-1234'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;
  let emailService: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    client: {
      findFirst: jest.fn(),
    }
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_jwt_token'),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key, defaultValue) => {
      if (key === 'JWT_SECRET') return 'test_secret';
      if (key === 'JWT_EXPIRES_IN') return '1h';
      return defaultValue;
    }),
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);
    emailService = module.get(EmailService);
    
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = { email: 'test@example.com', password: 'Password123!', agencyName: 'Test Agency' };

    it('should throw ConflictException if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });
      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });

    it('should successfully create a new user and send verification email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        agencyName: 'Test Agency',
        verificationToken: 'mock-uuid-1234'
      });

      const result = await service.signup(signupDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 12);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith('test@example.com', 'mock-uuid-1234');
      expect(result).toEqual({
        message: 'Account created successfully. Please check your email to verify your account.',
        requiresVerification: true,
        user: { email: 'test@example.com', agencyName: 'Test Agency' }
      });
    });

    it('should handle prisma create failure', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockPrismaService.user.create.mockRejectedValue(new Error('DB Error'));

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'Password123!' };

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', passwordHash: 'hashed_password' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should successfully login and return tokens', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        agencyName: 'Test Agency',
        plan: 'PRO',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(jwt.sign).toHaveBeenCalledWith({ sub: '1', email: 'test@example.com' });
      expect(result).toEqual({
        user: {
          id: '1',
          email: 'test@example.com',
          agencyName: 'Test Agency',
          plan: 'PRO',
          logo: undefined,
          primaryColor: undefined,
          accentColor: undefined,
        },
        accessToken: 'mock_jwt_token',
        expiresIn: '1h',
      });
    });
  });

  describe('demoLogin', () => {
    it('should return token for existing demo user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'demo123',
        email: 'demo.agency@reportiq.app',
        agencyName: 'Demo Agency'
      });

      const result = await service.demoLogin();
      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.user.email).toBe('demo.agency@reportiq.app');
    });

    it('should create demo user if not exists and return token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'new_demo123',
        email: 'demo.agency@reportiq.app',
        agencyName: 'Apex Growth Marketing (Demo)',
      });

      const result = await service.demoLogin();
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result.accessToken).toBe('mock_jwt_token');
    });
  });

  describe('googleLogin', () => {
    const mockProfile = {
      id: 'g123',
      emails: [{ value: 'google@example.com' }],
      displayName: 'Google Agency',
      photos: [{ value: 'avatar.png' }]
    };

    it('should return tokens for existing google user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: '1', email: 'google@example.com' });
      
      const result = await service.googleLogin(mockProfile);
      expect(result.accessToken).toBe('mock_jwt_token');
    });

    it('should create user if does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: '2', email: 'google@example.com' });

      const result = await service.googleLogin(mockProfile);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result.accessToken).toBe('mock_jwt_token');
    });
  });

  describe('verifyEmail', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should verify email and return tokens', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: '1', email: 'test@example.com' });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.verifyEmail('valid-token');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { emailVerified: true, verificationToken: null }
      });
      expect(result.message).toBe('Email verified successfully.');
      expect(result.accessToken).toBe('mock_jwt_token');
    });
  });

  describe('portalLogin', () => {
    const loginDto = { email: 'client@example.com', password: 'password123' };

    it('should throw UnauthorizedException if client not found', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(null);
      await expect(service.portalLogin(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle unhashed passwords for legacy support', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue({
        id: 'c1',
        email: 'client@example.com',
        portalPassword: 'password123',
        user: { agencyName: 'Agency' }
      });
      
      const result = await service.portalLogin(loginDto);
      expect(result.accessToken).toBe('mock_jwt_token');
    });

    it('should handle bcrypt hashed passwords', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue({
        id: 'c1',
        email: 'client@example.com',
        portalPassword: '$2a$12$somehashedpassword',
        user: { agencyName: 'Agency' }
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      const result = await service.portalLogin(loginDto);
      expect(result.accessToken).toBe('mock_jwt_token');
    });
  });
});
