import { z } from 'zod';

export const attributeMetadataSchema = z.object({
  description: z.string().optional(),
  icon: {
    name: z.string().optional(),
    viewBox: z.string().optional(),
    d: z.string().optional(),
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
  },
});
export type AttributeMetadataSchema = z.infer<typeof attributeMetadataSchema>;
