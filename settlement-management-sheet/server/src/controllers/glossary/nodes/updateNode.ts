import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateNode(req: any, res: any) {
  try {
    const { id, updates } = req.body;
    if (!requireFields(['id'], req.body, res)) return;
    const updatedEntry = await prisma.glossaryNode.update({
      where: { id },
      data: { ...updates },
    });
    return res.json({ entry: updatedEntry });
  } catch (error) {
    console.error(`Error updating entry:`, error);
    return res.status(500).json({ message: `Error updating entry.` });
  }
}
