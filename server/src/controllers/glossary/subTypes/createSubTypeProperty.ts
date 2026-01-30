import prisma from '../../../db/db.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function createSubTypeProperty(req: any, res: any) {
  try {
    const { property } = req.body;
    if (!requireFields(['property'], req.body, res)) return;

    const model = prisma.subTypeProperty;
    const contentType = (await isAdminUserId(req?.user?.id))
      ? 'SYSTEM'
      : 'CUSTOM';
    const createdBy = req?.user?.id || 'robbiepottsdm';

    const entryData = {
      ...property,
      contentType,
      createdBy,
    };

    const createdProperty = await prisma.$transaction([
      model.create({ data: entryData }),
    ]);

    return res.json({ createdProperty });
  } catch (error) {
    console.error(`Error creating subtype property:`, error);
    return res
      .status(500)
      .json({ message: `Error creating subtype property.` });
  }
}
