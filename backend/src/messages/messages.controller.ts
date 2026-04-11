import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ZodValidationPipe } from '../common/pipes/zodValidationPipe';
import type { Message, CreateMessagePayload } from '@chat-app/contracts';
import { createMessagePayloadSchema } from '@chat-app/contracts';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getMessages(): Message[] {
    return this.messagesService.getMessages();
  }
  @Post()
  @UsePipes(new ZodValidationPipe(createMessagePayloadSchema))
  setMessage(@Body() body: CreateMessagePayload): Message {
    return this.messagesService.setMessage(body);
  }
}
