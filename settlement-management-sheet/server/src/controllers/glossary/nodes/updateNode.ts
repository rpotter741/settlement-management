import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateNode(req: any, res: any) {
  try {
    const { id, name, fileType, parentId } = req.body;
    if (!requireFields(['id', 'name'], req.body, res)) return;
    const updatedEntry = await prisma.glossaryNode.update({
      where: { id },
      data: { name, fileType, parentId },
    });
    return res.json({ entry: updatedEntry });
  } catch (error) {
    console.error(`Error updating entry:`, error);
    return res.status(500).json({ message: `Error updating entry.` });
  }
}
