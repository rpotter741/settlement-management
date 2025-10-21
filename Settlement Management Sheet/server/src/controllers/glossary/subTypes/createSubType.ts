import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import glossaryTypeMap from '../../../utils/glossaryTypeMap.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';
import { EntryShape } from '@prisma/client';

export default async function createSubType(req: any, res: any) {
  try {
    const { glossaryId, subType } = req.body;
    if (!requireFields(['glossaryId', 'subType'], req.body, res)) return;

    const model = prisma.entrySubType;
    const contentType = (await isAdminUserId(req?.user?.id))
      ? 'SYSTEM'
      : 'CUSTOM';
    const createdBy = req?.user?.id || 'robbiepottsdm';

    const entryData = {
      ...subType,
      contentType,
      createdBy,
    };

    const createdSubType = await prisma.$transaction([
      model.create({ data: entryData }),
      prisma.glossary.update({
        where: { id: glossaryId },
        data: {
          subTypes: {
            connect: { id: subType.id },
          },
        },
      }),
    ]);

    return res.json({ createdSubType });
  } catch (error) {
    console.error(`Error creating entry with node:`, error);
    return res.status(500).json({ message: `Error creating entry with node.` });
  }
}
