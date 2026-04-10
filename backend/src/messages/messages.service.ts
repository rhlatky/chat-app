import { Injectable } from '@nestjs/common';
import {MessageDto} from "./dto/message.dto";
import {randomUUID} from "node:crypto";
import type {CreateMessageDto} from "./dto/createMessage.dto";

@Injectable()
export class MessagesService {
    private messages: MessageDto[] = [
        {id: randomUUID(), message: 'Hello there!', createdAt: new Date().toISOString(), username: 'Obi-wan', userId: randomUUID()},
        {id: randomUUID(), message: 'Kenobi!', createdAt: new Date().toISOString(), username: 'General-Grievous', userId: randomUUID()}
    ]

    getMessages(): MessageDto[] {
        return this.messages;
    }
    setMessage(message: CreateMessageDto): MessageDto {
        const messageToSet: MessageDto = {
            ...message,
            id: randomUUID(),
            createdAt: new Date().toISOString()
        };

        this.messages.push(messageToSet);
        return messageToSet;
    }
}