import {Body, Controller, Get, Post} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {CreateMessageDto} from "./dto/createMessage.dto";

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    getMessages(): string[] {
        return this.messagesService.getMessages();
    }
    @Post()
    setMessage(@Body() body: CreateMessageDto): string[] {
        return this.messagesService.setMessage(body.message);
    }
}
