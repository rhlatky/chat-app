import { CreateMessagePayload, Message } from '@chat-app/contracts';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
    return messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    }));
  }
  async setMessage(message: CreateMessagePayload): Promise<Message> {
    const createdMessage = await this.prisma.message.create({
      data: message,
    });

    return {
      ...createdMessage,
      createdAt: createdMessage.createdAt.toISOString(),
    };
  }
}
