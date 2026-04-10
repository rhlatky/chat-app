import { Test, TestingModule } from '@nestjs/testing';
import {MessagesController} from "./messages.controller";
import {MessagesService} from "./messages.service";

describe('MessagesService', () => {
    let service: MessagesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [MessagesController],
            providers: [MessagesService],
        }).compile();

        service = module.get(MessagesService);
    })

    it('should return messages', () => {
        const messages = service.getMessages();
        
        expect(messages.length).toBe(2)
    })

    it('should create and store new message', () => {
        const created = service.setMessage({
            userId: '550e8400-e29b-41d4-a716-446655440000',
            username: 'Anakin',
            message: 'Hello there',
        });

        expect(created.userId).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(created.username).toBe('Anakin');
        expect(created.message).toBe('Hello there');
        expect(created.id).toBeDefined();
        expect(created.createdAt).toBeDefined();

        const messages = service.getMessages();
        expect(messages).toHaveLength(3);
    });
})
