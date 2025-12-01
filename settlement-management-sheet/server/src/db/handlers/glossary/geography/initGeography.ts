import prisma from '@/db/db.js';
import { GlossaryGeography } from '@prisma/client';

export default async function initGeography({
  sectionId,
  geographyData,
}: {
  sectionId: string;
  geographyData: Partial<GlossaryGeography>;
}) {
  return await prisma.glossarySection.update({
    where: { id: sectionId },
    data: {
      geography: {
        create: {
          ...geographyData,
          version: geographyData.version ?? 1,
          customFields:
            geographyData.customFields === undefined
              ? undefined
              : (geographyData.customFields as any),
        },
      },
    },
  });
}
