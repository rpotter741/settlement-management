import { z } from 'zod';

export const iconSchema = z.object({
  icon: z.object({
    name: z.string().optional(),
    viewBox: z.string().optional(),
    d: z.string().optional(),
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
  }),
});
export type IconSchema = z.infer<typeof iconSchema>;
