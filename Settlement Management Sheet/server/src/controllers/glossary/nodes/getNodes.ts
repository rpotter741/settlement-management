import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function getNodes(req, res) {
  try {
    const { glossaryId } = req.query;
    if (!requireFields(['glossaryId'], req.query, res)) return;
    const structure = await prisma.glossaryNode.findMany({
      where: { glossaryId: glossaryId },
      orderBy: [{ sortIndex: 'asc' }],
      select: {
        id: true,
        name: true,
        entryType: true,
        fileType: true,
        parentId: true,
        sortIndex: true,
        glossaryId: true,
      },
    });
    return res.json(structure);
  } catch (error) {
    console.error(`Error getting glossary nodes:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary nodes, ${error}` });
  }
}
