import prisma from '../../../db/db.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function createSubTypeGroupController(req: any, res: any) {
  try {
    const { group } = req.body;
    if (!requireFields(['group'], req.body, res)) return;

    const model = prisma.subTypeGroup;
    const contentType = (await isAdminUserId(req?.user?.id))
      ? 'SYSTEM'
      : 'CUSTOM';
    const createdBy = req?.user?.id || 'robbiepottsdm';

    const entryData = {
      ...group,
      contentType,
      createdBy,
    };

    const createdGroup = await prisma.$transaction([
      model.create({ data: entryData }),
    ]);

    return res.json({ createdGroup });
  } catch (error) {
    console.error(`Error creating subtype group:`, error);
    return res.status(500).json({ message: `Error creating subtype group.` });
  }
}
