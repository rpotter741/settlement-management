import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateNodeParentId(req, res) {
  try {
    const { id, parentId } = req.body;
    if (!requireFields(['id', 'parentId'], req.body, res)) return;
    const updatedEntry = await prisma.glossaryNode.update({
      where: { id },
      data: { parentId },
    });
    return res.json({ entry: updatedEntry });
  } catch (error) {
    console.error(`Error updating entry parent ID:`, error);
    return res.status(500).json({ message: `Error updating entry parent ID.` });
  }
}
