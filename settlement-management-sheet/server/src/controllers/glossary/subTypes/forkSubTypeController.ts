import prisma from '../../../db/db.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';
import { cloneSubTypeWithNewIds } from '../../../utils/regenerateSubTypeIds.ts';

export default async function forkSubType(req: any, res: any) {
  try {
    const { subType, name } = req.body;
    if (!requireFields(['subType', 'name'], req.body, res)) return;

    const forkedEntry = cloneSubTypeWithNewIds(subType).newSubType;

    const model = prisma.entrySubType;
    const newestSubType = await model.findFirst({
      where: { refId: subType.refId },
      orderBy: { version: 'desc' },
    });

    const newVersionNumber = newestSubType ? newestSubType.version + 1 : 1;

    const contentType = (await isAdminUserId(req?.user?.id))
      ? 'SYSTEM'
      : 'CUSTOM';
    const createdBy = req?.user?.id || 'robbiepottsdm';

    const entryData = {
      ...forkedEntry,
      name,
      contentType,
      createdBy,
      version: newVersionNumber,
    };

    const createdSubType = await prisma.$transaction([
      model.create({ data: entryData }),
    ]);

    return res.json({ createdSubType });
  } catch (error) {
    console.error(`Error creating subType:`, error);
    return res.status(500).json({ message: `Error creating subType.` });
  }
}
