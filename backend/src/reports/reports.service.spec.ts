import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: {} },
        { provide: AiService, useValue: {} },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch mock reports when DB fails', async () => {
    const serviceWithMockPrisma = new ReportsService(
      { report: { findMany: jest.fn().mockRejectedValue(new Error('DB Error')) } } as any,
      {} as any
    );

    const result = await serviceWithMockPrisma.findAll('user-123');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe('mock-report-1');
  });
});
