import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
    private messages: string[] = ['message1', 'message2']

    getMessages(): string[] {
        return this.messages;
    }
    setMessage(message: string) {
        this.messages.push(message);
        return this.messages;
    }
}