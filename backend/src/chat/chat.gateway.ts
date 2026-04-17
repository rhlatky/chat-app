import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { randomUUID } from 'node:crypto';
import type { User, JoinPayload, SendMessagePayload } from '@chat-app/contracts';
import { joinPayloadSchema, socketEvents, sendMessagePayloadSchema } from '@chat-app/contracts';
import { ZodValidationPipe } from '../common/pipes/zodValidationPipe';
import { MessagesService } from '../messages/messages.service';

const wsExceptionFactory = (payload: { message: string; errors: unknown }) =>
  new WsException(payload);

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly messagesService: MessagesService) {}

  private loggedUsers = new Map<string, User>();

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage(socketEvents.JOIN)
  joinUser(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationPipe(joinPayloadSchema, wsExceptionFactory)) body: JoinPayload,
  ) {
    const usernameTaken = [...this.loggedUsers.values()].some(
      (user) => user.username.toLowerCase() === body.username.toLowerCase(),
    );

    if (usernameTaken) {
      const error = {
        code: 'USERNAME_TAKEN',
        message: 'Username is already taken',
      };
      throw new WsException(error);
    }

    const uuid = randomUUID();
    const user: User = {
      username: body.username,
      userId: uuid,
    };

    this.loggedUsers.set(client.id, user);
    client.emit(socketEvents.JOINED, user);
    this.server.emit(socketEvents.PRESENCE_UPDATED, [...this.loggedUsers.values()]);
  }

  @SubscribeMessage(socketEvents.SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationPipe(sendMessagePayloadSchema, wsExceptionFactory))
    body: SendMessagePayload,
  ) {
    const currentUser = this.loggedUsers.get(client.id);

    if (!currentUser) {
      throw new WsException({
        code: 'NOT JOINED',
        message: 'User is not joined',
      });
    }

    const createdMessage = await this.messagesService.setMessage({
      userId: currentUser.userId,
      username: currentUser.username,
      message: body.message,
    });

    this.server.emit(socketEvents.MESSAGE_RECEIVED, createdMessage);
  }

  handleDisconnect(client: Socket) {
    const isUserRemoved = this.loggedUsers.delete(client.id);

    if (isUserRemoved) {
      this.server.emit(socketEvents.PRESENCE_UPDATED, [...this.loggedUsers.values()]);
    }
  }
}
