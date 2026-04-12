import { jest } from '@jest/globals';
import { ChatGateway } from './chat.gateway';
import { MessagesService } from '../messages/messages.service';
import { socketEvents } from '@chat-app/contracts';
import type { Server, Socket } from 'socket.io';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let messagesService: jest.Mocked<Pick<MessagesService, 'setMessage'>>;
  let server: { emit: jest.Mock };

  const client = {
    id: 'socket-1',
    emit: jest.fn(),
  } as unknown as Socket;

  beforeEach(() => {
    messagesService = {
      setMessage: jest.fn(),
    };

    gateway = new ChatGateway(messagesService as unknown as MessagesService);

    server = {
      emit: jest.fn(),
    };

    gateway.server = server as unknown as Server;
  });

  it('joins a user and emits joined + presence_updated', () => {
    gateway.joinUser(client, {
      username: 'Anakin',
    });

    expect(client.emit).toHaveBeenCalledWith(
      socketEvents.JOINED,
      expect.objectContaining({
        username: 'Anakin',
        userId: expect.any(String),
      }),
    );

    expect(server.emit).toHaveBeenCalledWith(socketEvents.PRESENCE_UPDATED, [
      expect.objectContaining({
        username: 'Anakin',
        userId: expect.any(String),
      }),
    ]);
  });

  it('throw error on duplicate user', () => {
    const client2 = {
      id: 'socket-2',
      emit: jest.fn(),
    } as unknown as Socket;

    gateway.joinUser(client, {
      username: 'Anakin',
    });

    expect(() => gateway.joinUser(client2, { username: 'Anakin' })).toThrow();
  });
});
