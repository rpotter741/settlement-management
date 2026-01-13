import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateNodeParentId(req: any, res: any) {
  try {
    const { ids, parentId } = req.body;
    if (!requireFields(['ids', 'parentId'], req.body, res)) return;
    const updatedEntries = await prisma.glossaryNode.updateMany({
      where: { id: { in: ids } },
      data: { parentId },
    });
    return res.json({ entries: updatedEntries });
  } catch (error) {
    console.error(`Error updating entry parent ID:`, error);
    return res.status(500).json({ message: `Error updating entry parent ID.` });
  }
}
