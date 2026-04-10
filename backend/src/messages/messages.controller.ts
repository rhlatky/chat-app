import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {createMessageDtoSchema} from "./dto/createMessage.dto";
import type {CreateMessageDto} from "./dto/createMessage.dto";
import {ZodValidationPipe} from "../common/pipes/zodValidationPipe";

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    getMessages(): string[] {
        return this.messagesService.getMessages();
    }
    @Post()
    @UsePipes(new ZodValidationPipe(createMessageDtoSchema))
    setMessage(@Body() body: CreateMessageDto): string[] {
        return this.messagesService.setMessage(body.message);
    }
}
