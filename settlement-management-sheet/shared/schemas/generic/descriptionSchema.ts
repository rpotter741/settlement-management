import { z } from 'zod';

export const descriptionSchema = z.object({
  description: z.string().min(30).optional(),
});
export type DescriptionSchema = z.infer<typeof descriptionSchema>;
