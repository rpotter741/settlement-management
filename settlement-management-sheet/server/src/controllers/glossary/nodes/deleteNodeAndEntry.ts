import prisma from '../../../db/db.ts';

import collectEntriesByTypeFromFlat from '../../../utils/collectEntriesByType.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function deleteNodeAndEntry(req: any, res: any) {
  try {
    const { id, glossaryId } = req.body;
    if (!requireFields(['id', 'glossaryId'], req.body, res)) return;

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
      },
    });

    const idsByType = collectEntriesByTypeFromFlat(id, structure);

    await prisma.$transaction([
      prisma.glossaryNode.delete({ where: { id } }),
      ...Object.entries(idsByType).flatMap(([type, ids]) => {
        const model = prisma.glossaryEntry;
        return model
          ? [(model as any).deleteMany({ where: { id: { in: ids } } })]
          : [];
      }),
    ]);
    return res.json({ message: 'Entry and node deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting entry with node:`, error);
    return res.status(500).json({ message: `Error deleting entry with node.` });
  }
}
