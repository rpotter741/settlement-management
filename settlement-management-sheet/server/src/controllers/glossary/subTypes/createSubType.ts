import prisma from '../../../db/db.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function createSubType(req: any, res: any) {
  try {
    const { subType } = req.body;
    if (!requireFields(['subType'], req.body, res)) return;

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
    ]);

    return res.json({ createdSubType });
  } catch (error) {
    console.error(`Error creating subType:`, error);
    return res.status(500).json({ message: `Error creating subType.` });
  }
}
