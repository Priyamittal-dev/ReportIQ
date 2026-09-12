import { Test, TestingModule } from '@nestjs/testing';
import { AiService, ReportMetrics } from './ai.service';
import { ConfigService } from '@nestjs/config';

// Mock OpenAI
const mockCreateChatCompletion = jest.fn();
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreateChatCompletion,
        },
      },
    })),
  };
});

describe('AiService', () => {
  let service: AiService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'OPENAI_API_KEY') return 'test-key';
      if (key === 'USE_MOCK_AI') return 'false';
      if (key === 'OPENAI_MODEL') return 'gpt-4o';
      return null;
    }),
  };

  const sampleMetrics: ReportMetrics = {
    sessions: 1000,
    previousSessions: 500,
    conversions: 50,
    previousConversions: 20,
    conversionRate: 5,
    revenue: 5000,
    bounceRate: 40,
    period: 'This month'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    configService = module.get<ConfigService>(ConfigService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateReportSummary', () => {
    it('should return mock summary if USE_MOCK_AI is true', async () => {
      mockConfigService.get.mockImplementationOnce((k) => k === 'USE_MOCK_AI' ? 'true' : 'test-key');
      const result = await service.generateReportSummary('Agency A', 'Client X', sampleMetrics);
      expect(result.summary).toContain('Client X had an excellent performance period');
      expect(result.insights.length).toBe(3);
      expect(mockCreateChatCompletion).not.toHaveBeenCalled();
    });

    it('should return openai summary on success', async () => {
      const mockResponse = {
        summary: 'OpenAI Summary',
        insights: ['Insight 1', 'Insight 2', 'Insight 3']
      };
      mockCreateChatCompletion.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(mockResponse) } }]
      });

      const result = await service.generateReportSummary('Agency A', 'Client X', sampleMetrics);
      expect(result).toEqual(mockResponse);
      expect(mockCreateChatCompletion).toHaveBeenCalled();
    });

    it('should fallback to mock summary if openai throws error', async () => {
      mockCreateChatCompletion.mockRejectedValueOnce(new Error('API Down'));
      const result = await service.generateReportSummary('Agency A', 'Client X', sampleMetrics);
      expect(result.summary).toContain('Client X had an excellent performance period');
    });
  });

  describe('chat', () => {
    it('should return openai response for chat', async () => {
      mockCreateChatCompletion.mockResolvedValueOnce({
        choices: [{ message: { content: 'Hello from AI' } }]
      });

      const result = await service.chat('Hello');
      expect(result).toBe('Hello from AI');
    });

    it('should fallback to local chat if openai throws error', async () => {
      mockCreateChatCompletion.mockRejectedValueOnce(new Error('API Down'));
      const result = await service.chat('how do I create a report');
      expect(result).toContain('To generate a report, go to **Reports**');
    });

    it('should return local chat if USE_MOCK_AI is true', async () => {
      mockConfigService.get.mockImplementationOnce((k) => k === 'USE_MOCK_AI' ? 'true' : 'test-key');
      const result = await service.chat('add client');
      expect(result).toContain('To add a new client, navigate to **Clients**');
      expect(mockCreateChatCompletion).not.toHaveBeenCalled();
    });
  });

  describe('generateActionPlan', () => {
    it('should generate action plan using openai', async () => {
      const mockPlan = {
        plan: 'Strategic plan here',
        actionItems: [{ task: 'Do this', priority: 'High' }]
      };
      mockCreateChatCompletion.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(mockPlan) } }]
      });

      const result = await service.generateActionPlan('Agency A', 'Client X', sampleMetrics);
      expect(result).toEqual(mockPlan);
    });

    it('should fallback to mock action plan on error', async () => {
      mockCreateChatCompletion.mockRejectedValueOnce(new Error('API Error'));
      const result = await service.generateActionPlan('Agency A', 'Client X', sampleMetrics);
      expect(result.plan).toContain('Based on Client X');
      expect(result.actionItems.length).toBe(3);
    });
  });

  describe('generateDashboardFromCsv', () => {
    it('should generate dashboard using openai', async () => {
      const mockDashboard = {
        summary: 'CSV Data Summary',
        insights: ['insight 1'],
        charts: []
      };
      mockCreateChatCompletion.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(mockDashboard) } }]
      });

      const result = await service.generateDashboardFromCsv('id,name\n1,Test');
      expect(result).toEqual(mockDashboard);
    });

    it('should fallback to mock dashboard on error', async () => {
      mockCreateChatCompletion.mockRejectedValueOnce(new Error('API Error'));
      const result = await service.generateDashboardFromCsv('id,name\n1,Test');
      expect(result.summary).toContain('The uploaded data shows strong performance');
      expect(result.charts.length).toBeGreaterThan(0);
    });
  });
});
