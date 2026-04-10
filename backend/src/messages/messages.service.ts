import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
    getMessages(): string[] {
        return ['message1', 'message2'];
    }
}