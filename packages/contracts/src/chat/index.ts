import { z } from 'zod';

export enum socketEvents {
  JOIN = 'join',
  JOINED = 'joined',
  PRESENCE_UPDATED = 'presence_updated',
  SEND_MESSAGE = 'send_message',
  MESSAGE_RECEIVED = 'message_received',
}

export const joinPayloadSchema = z.object({
  username: z.string().trim().min(1),
});

export const userSchema = z.object({
  userId: z.uuid(),
  username: z.string().trim().min(1).max(30),
});

export const presencePayloadSchema = z.array(userSchema);

export const sendMessagePayloadSchema = z.object({
  message: z.string().trim().min(1),
});

export type JoinPayload = z.infer<typeof joinPayloadSchema>;
export type User = z.infer<typeof userSchema>;
export type PresencePayload = z.infer<typeof presencePayloadSchema>;
export type SendMessagePayload = z.infer<typeof sendMessagePayloadSchema>;
