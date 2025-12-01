import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function getEntriesById(req: any, res: any) {
  console.log('here');
  try {
    const { ids } = req.body;
    if (!requireFields(['ids'], req.body, res)) return;
    const result = await prisma.$transaction(async (tx) => {
      const entries = await tx.glossaryEntry.findMany({
        where: { id: { in: ids } },
      });
      const backlinks = await tx.backlinkIndex.findMany({
        where: { OR: [{ targetId: { in: ids } }, { sourceId: { in: ids } }] },
      });
      return { entries, backlinks };
    });

    if (!result || result.entries.length === 0) {
      return res.status(404).json({ message: `Entries not found.` });
    }
    return res.json(result);
  } catch (error) {
    console.error(`Error getting glossary node by ID:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary node by ID.` });
  }
}
