import { jest } from '@jest/globals';
import { ChatGateway } from './chat.gateway';
import { MessagesService } from '../messages/messages.service';
import { socketEvents } from '@chat-app/contracts';
import type { Server, Socket } from 'socket.io';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let messagesService: jest.Mocked<Pick<MessagesService, 'setMessage'>>;
  let server: Server;
  let serverEmit: jest.Mock;

  let client: Socket;
  let clientEmit: jest.Mock;

  beforeEach(() => {
    messagesService = {
      setMessage: jest.fn(),
    };

    gateway = new ChatGateway(messagesService as unknown as MessagesService);

    serverEmit = jest.fn();
    server = {
      emit: serverEmit,
    } as unknown as Server;

    gateway.server = server;

    clientEmit = jest.fn();
    client = {
      id: 'socket-1',
      emit: clientEmit,
    } as unknown as Socket;
  });

  it('joins a user and emits joined + presence_updated', () => {
    gateway.joinUser(client, {
      username: 'Anakin',
    });

    expect(clientEmit).toHaveBeenCalledWith(
      socketEvents.JOINED,
      expect.objectContaining({
        username: 'Anakin',
        userId: expect.any(String),
      }),
    );

    expect(serverEmit).toHaveBeenCalledWith(socketEvents.PRESENCE_UPDATED, [
      expect.objectContaining({
        username: 'Anakin',
        userId: expect.any(String),
      }),
    ]);
  });

  it('throws error on duplicate user', () => {
    const client2 = {
      id: 'socket-2',
      emit: jest.fn(),
    } as unknown as Socket;

    gateway.joinUser(client, {
      username: 'Anakin',
    });

    expect(() => gateway.joinUser(client2, { username: 'Anakin' })).toThrow();
  });

  it('sends a message for a joined user and emits message_received', () => {
    gateway.joinUser(client, {
      username: 'Anakin',
    });

    const joinedUser = clientEmit.mock.calls[0]?.[1] as {
      userId: string;
      username: string;
    };

    expect(joinedUser).toEqual(
      expect.objectContaining({
        username: 'Anakin',
        userId: expect.any(String),
      }),
    );

    const createdMessage = {
      id: 'message-1',
      userId: joinedUser.userId,
      username: joinedUser.username,
      message: 'Hello there',
      createdAt: '2026-04-15T10:00:00.000Z',
    };

    messagesService.setMessage.mockReturnValue(createdMessage);

    clientEmit.mockClear();
    serverEmit.mockClear();

    gateway.sendMessage(client, {
      message: 'Hello there',
    });

    expect(messagesService.setMessage).toHaveBeenCalledWith({
      userId: joinedUser.userId,
      username: joinedUser.username,
      message: 'Hello there',
    });

    expect(serverEmit).toHaveBeenCalledWith(socketEvents.MESSAGE_RECEIVED, createdMessage);
  });

  it('throws when unjoined user tries to send a message', () => {
    expect(() =>
      gateway.sendMessage(client, {
        message: 'Hello there',
      }),
    ).toThrow();

    expect(messagesService.setMessage).not.toHaveBeenCalled();
    expect(serverEmit).not.toHaveBeenCalled();
  });

  it('removes user on disconnect and emits updated presence', () => {
    gateway.joinUser(client, {
      username: 'Anakin',
    });

    serverEmit.mockClear();

    gateway.handleDisconnect(client);

    expect(serverEmit).toHaveBeenCalledWith(socketEvents.PRESENCE_UPDATED, []);
  });
});
