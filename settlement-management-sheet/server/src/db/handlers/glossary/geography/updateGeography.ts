import prisma from '@/db/db.js';
import { GlossaryGeography } from '@prisma/client';

export default async function updateGeography({
  geographyId,
  geographyData,
}: {
  geographyId: string;
  geographyData: Partial<GlossaryGeography>;
}) {
  return await prisma.glossaryGeography.update({
    where: { id: geographyId },
    data: {
      ...geographyData,
      version: geographyData.version ?? 1,
      customFields:
        geographyData.customFields === undefined
          ? undefined
          : (geographyData.customFields as any),
    },
  });
}
