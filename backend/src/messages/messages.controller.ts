import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ZodValidationPipe } from '../common/pipes/zodValidationPipe';
import type { MessageDto, CreateMessageDto } from '@chat-app/contracts';
import { createMessageDtoSchema } from '@chat-app/contracts';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getMessages(): MessageDto[] {
    return this.messagesService.getMessages();
  }
  @Post()
  @UsePipes(new ZodValidationPipe(createMessageDtoSchema))
  setMessage(@Body() body: CreateMessageDto): MessageDto {
    return this.messagesService.setMessage(body);
  }
}
