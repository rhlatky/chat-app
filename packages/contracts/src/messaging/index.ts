import { z } from 'zod';

export const messageSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  username: z.string().trim().min(1),
  message: z.string().trim().min(1),
  createdAt: z.string(),
});

export const createMessagePayloadSchema = z
  .object({
    username: z.string().trim().min(1),
    userId: z.uuid(),
    message: z.string().trim().min(1),
  })
  .required();

export type Message = z.infer<typeof messageSchema>;

export type CreateMessagePayload = z.infer<typeof createMessagePayloadSchema>;
