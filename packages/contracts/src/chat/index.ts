import { z } from 'zod';

export enum socketEvents {
  JOIN = 'join',
  JOINED = 'joined',
  PRESENCE_UPDATED = 'presence_updated',
  ERROR = 'error',
}

export const joinPayloadSchema = z.object({
  username: z.string().trim().min(1),
});

export const userSchema = z.object({
  userId: z.uuid(),
  username: z.string().trim().min(1).max(30),
});

export const presencePayloadSchema = z.array(userSchema);

export type JoinPayload = z.infer<typeof joinPayloadSchema>;
export type User = z.infer<typeof userSchema>;
export type PresencePayload = z.infer<typeof presencePayloadSchema>;
