import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {createMessageDtoSchema} from "./dto/createMessage.dto";
import type {CreateMessageDto} from "./dto/createMessage.dto";
import {ZodValidationPipe} from "../common/pipes/zodValidationPipe";
import type {MessageDto} from "./dto/message.dto";

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
