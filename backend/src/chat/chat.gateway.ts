import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { randomUUID } from 'node:crypto';
import type { User, JoinPayload } from '@chat-app/contracts';
import { joinPayloadSchema, socketEvents } from '@chat-app/contracts';
import { UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zodValidationPipe';

const wsExceptionFactory = (payload: { message: string; errors: unknown }) =>
  new WsException(payload);

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  private loggedUsers = new Map<string, User>();

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage(socketEvents.JOIN)
  joinUser(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationPipe(joinPayloadSchema, wsExceptionFactory)) body: JoinPayload,
  ) {
    console.log('join attempt', body.username);
    console.log('logged users', [...this.loggedUsers.values()]);
    const usernameTaken = [...this.loggedUsers.values()].some(
      (user) => user.username === body.username,
    );

    if (usernameTaken) {
      const error = {
        code: 'USERNAME_TAKEN',
        message: 'Username is already taken',
      };
      client.emit(socketEvents.ERROR, error);
      throw new WsException(error);
    }

    console.log('aaaaaaa');

    const uuid = randomUUID();
    const user: User = {
      username: body.username,
      userId: uuid,
    };

    this.loggedUsers.set(client.id, user);
    client.emit(socketEvents.JOINED, user);
    this.server.emit(socketEvents.PRESENCE_UPDATED, [...this.loggedUsers.values()]);
  }
  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
