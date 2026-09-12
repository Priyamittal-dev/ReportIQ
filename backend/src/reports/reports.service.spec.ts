import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { NotFoundException } from '@nestjs/common';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: any;
  let aiService: any;

  const mockPrismaService = {
    report: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    client: {
      findUnique: jest.fn(),
    }
  };

  const mockAiService = {
    generateReportSummary: jest.fn(),
    generateActionPlan: jest.fn(),
    generateDashboardFromCsv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get(PrismaService);
    aiService = module.get(AiService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return reports from DB', async () => {
      const reports = [{ id: '1', title: 'Report 1' }];
      mockPrismaService.report.findMany.mockResolvedValue(reports);
      const result = await service.findAll('user-1');
      expect(result).toEqual(reports);
    });

    it('should fallback to mock reports if DB fails', async () => {
      mockPrismaService.report.findMany.mockRejectedValue(new Error('DB error'));
      const result = await service.findAll('user-1');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('mock-report-1');
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if report not found in DB or mocks', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue(null);
      await expect(service.findOne('invalid-id', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should return report from DB', async () => {
      const report = { id: 'rep-1', title: 'Test Report' };
      mockPrismaService.report.findFirst.mockResolvedValue(report);
      const result = await service.findOne('rep-1', 'user-1');
      expect(result).toEqual(report);
    });

    it('should return mock report if requested by id and not in DB', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue(null);
      const result = await service.findOne('mock-report-1', 'user-1');
      expect(result.id).toBe('mock-report-1');
    });
  });

  describe('findPublic', () => {
    it('should return public report from DB', async () => {
      const report = { id: 'rep-1', publicSlug: 'slug-1', title: 'Public Report' };
      mockPrismaService.report.findFirst.mockResolvedValue(report);
      const result = await service.findPublic('slug-1');
      expect(result).toEqual(report);
    });

    it('should fallback to mock report for public slug', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue(null);
      const result = await service.findPublic('bright-digital-may-2024');
      expect(result.id).toBe('mock-report-1');
    });

    it('should throw NotFoundException if public report not found', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue(null);
      await expect(service.findPublic('invalid-slug')).rejects.toThrow(NotFoundException);
    });
  });

  describe('generate', () => {
    it('should generate report successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ agencyName: 'My Agency' });
      mockPrismaService.client.findUnique.mockResolvedValue({ name: 'My Client' });
      
      mockAiService.generateReportSummary.mockResolvedValue({
        summary: 'AI Summary',
        insights: ['insight1']
      });
      mockAiService.generateActionPlan.mockResolvedValue({
        plan: 'AI Plan',
        actionItems: [{ task: 'Task', priority: 'High' }]
      });

      const dbReport = { id: 'new-report', title: 'Generated Report' };
      mockPrismaService.report.create.mockResolvedValue(dbReport);

      const result = await service.generate('user-1', 'client-1', { sessions: 100 }, 'Custom Title');
      expect(result).toEqual(dbReport);
      expect(mockPrismaService.report.create).toHaveBeenCalled();
      expect(mockAiService.generateReportSummary).toHaveBeenCalled();
    });

    it('should fallback to mock report creation if DB create fails', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(new Error());
      mockPrismaService.client.findUnique.mockRejectedValue(new Error());
      
      mockAiService.generateReportSummary.mockResolvedValue({ summary: 'AI Summary', insights: [] });
      mockAiService.generateActionPlan.mockResolvedValue({ plan: 'AI Plan', actionItems: [] });

      mockPrismaService.report.create.mockRejectedValue(new Error('DB Failed'));

      const result = await service.generate('user-1', 'client-1', {});
      expect(result.id).toContain('mock-');
      expect(result.aiSummary).toBe('AI Summary');
    });
  });

  describe('getSlides', () => {
    it('should return presentation slides structure', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue({
        id: 'rep-1',
        title: 'Q3 Report',
        metricsData: '{"sessions": 5000}',
        aiInsights: '["insight"]',
        aiActionPlan: '{"actionItems": []}',
        client: { name: 'Test Client' },
        user: { agencyName: 'Test Agency' }
      });

      const result = await service.getSlides('rep-1');
      expect(result.title).toBe('Q3 Report');
      expect(result.slides.length).toBe(5);
      expect(result.slides[0].type).toBe('cover');
      expect(result.slides[4].type).toBe('actionPlan');
    });

    it('should handle malformed JSON gracefully', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue({
        id: 'rep-1',
        title: 'Q3 Report',
        metricsData: 'invalid-json',
      });

      const result = await service.getSlides('rep-1');
      expect(result.slides[1].metrics[0].value).toBe('4,231'); // Fallback value
    });
  });

  describe('updateWorkflow', () => {
    it('should throw if report not found', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue(null);
      await expect(service.updateWorkflow('1', 'user-1', 'APPROVED')).rejects.toThrow(NotFoundException);
    });

    it('should update workflow with new comments', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue({ id: '1', status: 'READY', internalNotes: '[]' });
      mockPrismaService.user.findUnique.mockResolvedValue({ agencyName: 'Agency' });
      mockPrismaService.report.update.mockResolvedValue({ id: '1', status: 'APPROVED' });

      await service.updateWorkflow('1', 'user-1', 'APPROVED', 'Looks good');
      
      expect(mockPrismaService.report.update).toHaveBeenCalled();
      const updateCall = mockPrismaService.report.update.mock.calls[0][0];
      expect(updateCall.data.status).toBe('APPROVED');
      expect(updateCall.data.internalNotes).toContain('Looks good');
    });
  });

  describe('dispatchMultiChannel', () => {
    it('should dispatch to email', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue({ id: '1', title: 'Report 1', client: { email: 'client@test.com' } });
      const result = await service.dispatchMultiChannel('1', { channel: 'email' });
      expect(result.success).toBe(true);
      expect(result.channel).toBe('email');
    });

    it('should dispatch to slack', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue({ id: '1', title: 'Report 1' });
      const result = await service.dispatchMultiChannel('1', { channel: 'slack', target: 'webhook' });
      expect(result.success).toBe(true);
      expect(result.channel).toBe('slack');
    });

    it('should throw NotFoundException if report does not exist', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue(null);
      await expect(service.dispatchMultiChannel('1', { channel: 'email' })).rejects.toThrow(NotFoundException);
    });
  });
});
