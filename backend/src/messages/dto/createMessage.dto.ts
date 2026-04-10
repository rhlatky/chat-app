import { z } from 'zod';

export const createMessageDtoSchema = z
    .object({
        message: z.string(),
    })
    .required();

export type CreateMessageDto = z.infer<typeof createMessageDtoSchema>;
