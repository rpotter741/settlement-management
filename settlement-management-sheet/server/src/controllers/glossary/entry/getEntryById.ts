import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function getEntryById(req: any, res: any) {
  try {
    const { id } = req.query;
    if (!requireFields(['id'], req.query, res)) return;
    const result = await prisma.$transaction(async (tx) => {
      const entry = await tx.glossaryEntry.findUnique({
        where: { id },
      });
      const backlinksTo = await tx.backlinkIndex.findMany({
        where: { targetId: id },
      });
      const backlinksFrom = await tx.backlinkIndex.findMany({
        where: { sourceId: id },
      });
      return { entry, backlinksTo, backlinksFrom };
    });

    if (!result.entry) {
      return res.status(404).json({ message: `Entry not found.` });
    }
    return res.json(result);
  } catch (error) {
    console.error(`Error getting glossary node by ID:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary node by ID.` });
  }
}
