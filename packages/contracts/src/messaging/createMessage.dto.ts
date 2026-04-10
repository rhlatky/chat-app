import { z } from 'zod';

export const createMessageDtoSchema = z
  .object({
    username: z.string().trim().min(1),
    userId: z.uuid(),
    message: z.string().trim().min(1),
  })
  .required();

export type CreateMessageDto = z.infer<typeof createMessageDtoSchema>;
