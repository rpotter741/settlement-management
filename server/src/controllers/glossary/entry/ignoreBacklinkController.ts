import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function ignoreBacklinkController(req: any, res: any) {
  try {
    const { linkId, targetIgnore } = req.body;
    if (!requireFields(['linkId', 'targetIgnore'], req.body, res)) return;

    const newLink = await prisma.backlinkIndex.update({
      where: { id: linkId },
      data: { targetIgnore },
    });

    return res.json({
      message: 'Backlink updated successfully.',
      data: newLink,
    });
  } catch (error) {
    console.error(`Error updating Backlink:`, error);
    return res.status(500).json({ message: `Error updating Backlink.` });
  }
}
