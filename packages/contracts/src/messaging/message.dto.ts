import { z } from 'zod';

export const messageDtoSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  username: z.string().trim().min(1),
  message: z.string().trim().min(1),
  createdAt: z.string(),
});

export type MessageDto = z.infer<typeof messageDtoSchema>;
