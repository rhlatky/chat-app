import { Test } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MessagesService', () => {
  let service: MessagesService;

  let prismaService: {
    message: {
      findMany: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaService = {
      message: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        MessagesService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get(MessagesService);
  });

  it('should return messages', async () => {
    prismaService.message.findMany.mockResolvedValue([
      {
        id: 'message-1',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        username: 'Anakin',
        message: 'Hello there',
        createdAt: new Date('2026-04-17T10:00:00.000Z'),
      },
    ]);

    const messages = await service.getMessages();

    expect(prismaService.message.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'asc',
      },
    });
    expect(messages).toEqual([
      {
        id: 'message-1',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        username: 'Anakin',
        message: 'Hello there',
        createdAt: '2026-04-17T10:00:00.000Z',
      },
    ]);
  });

  it('creates a message via Prisma and maps createdAt to ISO string', async () => {
    prismaService.message.create.mockResolvedValue({
      id: 'message-1',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      username: 'Master Yoda',
      message: 'Pass the test, you must',
      createdAt: new Date('2026-04-17T10:00:00.000Z'),
    });

    const created = await service.setMessage({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      username: 'Master Yoda',
      message: 'Pass the test, you must',
    });

    expect(prismaService.message.create).toHaveBeenCalledWith({
      data: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        username: 'Master Yoda',
        message: 'Pass the test, you must',
      },
    });

    expect(created).toEqual({
      id: 'message-1',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      username: 'Master Yoda',
      message: 'Pass the test, you must',
      createdAt: '2026-04-17T10:00:00.000Z',
    });
  });
});
