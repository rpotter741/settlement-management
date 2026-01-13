import { GenericObject } from '../../../../../shared/types/common.ts';
import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateAnchorsController(req: any, res: any) {
  try {
    const { subtypeId, anchors }: { subtypeId: string; anchors: any } =
      req.body;
    if (!requireFields(['subtypeId', 'anchors'], req.body, res)) return;

    await prisma.entrySubType.update({
      where: { id: subtypeId },
      data: { anchors },
    });

    return res.json({
      message: 'SubType anchors updated successfully.',
    });
  } catch (error) {
    console.error(`Error updating SubType anchors:`, error);
    return res.status(500).json({ message: `Error updating SubType anchors.` });
  }
}
