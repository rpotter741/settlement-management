import { z } from 'zod';

export const geographySchema = z.object({
  climates: z.array(z.string()).nullable().optional(),
  terrain: z.array(z.string()).nullable().optional(),
  regions: z.array(z.string()).nullable().optional(),
  landmarks: z.array(z.string()).nullable().optional(),
  customFields: z.record(z.string(), z.any()).nullable().optional(),
});
export type GeographySchema = z.infer<typeof geographySchema>;
