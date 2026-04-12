import { CreateMessagePayload, Message } from '@chat-app/contracts';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class MessagesService {
  private messages: Message[] = [];

  getMessages(): Message[] {
    return this.messages;
  }
  setMessage(message: CreateMessagePayload): Message {
    const messageToSet: Message = {
      ...message,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.messages.push(messageToSet);
    return messageToSet;
  }
}
