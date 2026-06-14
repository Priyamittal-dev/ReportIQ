import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    client: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of clients for a user', async () => {
      const mockClients = [{ id: '1', name: 'Test Client', userId: 'user_1' }];
      mockPrismaService.client.findMany.mockResolvedValue(mockClients);

      const result = await service.findAll('user_1');
      expect(result).toEqual(mockClients);
      expect(mockPrismaService.client.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_1' },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { reports: true } } },
      });
    });
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const dto = { name: 'New Client', email: 'test@new.com', timezone: 'UTC' };
      const mockCreated = { id: '2', ...dto, userId: 'user_1' };
      mockPrismaService.client.create.mockResolvedValue(mockCreated);

      const result = await service.create('user_1', dto);
      expect(result).toEqual(mockCreated);
      expect(mockPrismaService.client.create).toHaveBeenCalledWith({
        data: { ...dto, userId: 'user_1' },
      });
    });
  });
});
