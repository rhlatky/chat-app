import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { randomUUID } from 'node:crypto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  private loggedUsers = new Map<string, string>();

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  joinUser(@MessageBody() body: { username: string }) {
    if (body.username.trim().length) {
      const uuid = randomUUID();
      this.loggedUsers.set(uuid, body.username);
      return uuid;
    }
    return new WsException('invalid username');
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
