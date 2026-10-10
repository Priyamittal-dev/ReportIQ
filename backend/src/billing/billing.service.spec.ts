import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BillingService } from './billing.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BillingService', () => {
  let service: BillingService;
  let prisma: any;
  let config: any;

  const mockUser = {
    id: 'user-123',
    email: 'agency@example.com',
    plan: 'PRO',
    stripeCustomerId: 'cus_123',
    stripeSubscriptionId: 'sub_123',
    stripePriceId: 'price_123',
    stripeCurrentPeriodEnd: new Date('2026-12-31'),
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(mockUser),
        findFirst: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn().mockImplementation(({ data }) => Promise.resolve({ ...mockUser, ...data })),
      },
    };

    config = {
      get: jest.fn().mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'STRIPE_SECRET_KEY') return 'sk_test_placeholder';
        if (key === 'FRONTEND_URL') return 'http://localhost:3000';
        return defaultValue || null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBillingStatus', () => {
    it('should return billing status and default card for paid user', async () => {
      const status = await service.getBillingStatus('user-123');
      expect(status.plan).toBe('PRO');
      expect(status.paymentMethod).toBeDefined();
      expect(status.paymentMethod?.last4).toBe('4242');
      expect(status.invoices.length).toBeGreaterThan(0);
    });

    it('should throw error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(service.getBillingStatus('non-existent')).rejects.toThrow(HttpException);
    });
  });

  describe('createCheckoutSession', () => {
    it('should create mock checkout redirect when in mock mode', async () => {
      const result = await service.createCheckoutSession('user-123', 'AGENCY');
      expect(result.url).toContain('/dashboard/billing?success=true&plan=AGENCY');
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequest for invalid plan', async () => {
      await expect(service.createCheckoutSession('user-123', 'ULTIMATE')).rejects.toThrow(
        new HttpException('Invalid plan selected. Choose PRO or AGENCY.', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('updatePaymentMethod', () => {
    it('should update payment method successfully', async () => {
      const result = await service.updatePaymentMethod('user-123', {
        brand: 'mastercard',
        last4: '8888',
        expMonth: 8,
        expYear: 2029,
      });

      expect(result.success).toBe(true);
      expect(result.paymentMethod.brand).toBe('mastercard');
      expect(result.paymentMethod.last4).toBe('8888');
    });
  });

  describe('cancelSubscription', () => {
    it('should downgrade user to STARTER', async () => {
      const result = await service.cancelSubscription('user-123');
      expect(result.success).toBe(true);
      expect(result.plan).toBe('STARTER');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-123' },
          data: expect.objectContaining({ plan: 'STARTER', stripeSubscriptionId: null }),
        }),
      );
    });
  });

  describe('createCustomerPortalSession', () => {
    it('should return portal url', async () => {
      const result = await service.createCustomerPortalSession('user-123');
      expect(result.url).toContain('/dashboard/billing');
    });
  });
});
