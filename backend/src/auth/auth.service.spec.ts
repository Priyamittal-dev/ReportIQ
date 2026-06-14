import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrismaService = {
    agency: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'JWT_SECRET') return 'test_secret';
      if (key === 'JWT_EXPIRES_IN') return '1h';
      return null;
    }),
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn(),
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
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw an error if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'test@test.com', password: 'password' }))
        .rejects
        .toThrow('Invalid email or password.');
    });

    // We can mock bcrypt to test successful login, but we'll keep it simple for the critical path
    it('should return token if credentials are valid (mocked)', async () => {
      // Setup mock user
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hashedpassword',
        agencyId: 'agency_1',
        agency: { id: 'agency_1', name: 'Test Agency' },
        isEmailVerified: true,
      };
      
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      
      // Override bcrypt.compare temporarily for this test
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      
      mockJwtService.sign.mockReturnValue('test_token');

      const result = await service.login({ email: 'test@test.com', password: 'password' });

      expect(result).toEqual({ accessToken: 'test_token', expiresIn: '1h', user: expect.any(Object) });
    });
  });
});
