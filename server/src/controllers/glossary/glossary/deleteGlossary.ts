import prisma from '../../../db/db.ts';
import collectEntriesByTypeFromFlat from '../../../utils/collectEntriesByType.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function deleteGlossary(req: any, res: any) {
  try {
    const { id } = req.body;
    if (!requireFields(['id'], req.body, res)) return;

    const structure = await prisma.glossaryNode.findMany({
      where: { glossaryId: id },
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

    const onlyTops = structure.filter((node) => !node.parentId);

    const idsByType = onlyTops.reduce((acc, node) => {
      const nodeChildrenIds = collectEntriesByTypeFromFlat(node.id, structure);
      Object.entries(nodeChildrenIds).forEach(([type, ids]) => {
        if (!acc[type]) acc[type] = [];
        acc[type].push(...ids);
      });
      return acc;
    }, {});

    await prisma.$transaction([
      prisma.glossary.delete({ where: { id } }),
      ...Object.entries(idsByType).flatMap(([type, ids]) => {
        const model = isDetailFileType(type)
          ? glossaryModelMap[type]
          : prisma.glossarySection;
        return model
          ? [(model as any).deleteMany({ where: { id: { in: ids } } })]
          : [];
      }),
    ]);

    return res.json({ message: 'Glossary deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting glossary:`, error);
    return res.status(500).json({ message: `Error deleting glossary.` });
  }
}
