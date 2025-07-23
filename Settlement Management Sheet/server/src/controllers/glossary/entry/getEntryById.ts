import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function getEntryById(req, res) {
  try {
    const { id, entryType } = req.query;
    if (!requireFields(['id', 'entryType'], req.query, res)) return;
    const entryModel = isDetailFileType(entryType)
      ? glossaryModelMap[entryType]
      : prisma.glossarySection;
    if (!entryModel) {
      console.log(`Invalid entry type:`, entryType);
      return res.status(400).json({ message: `Invalid entry type.` });
    }
    const entry = await (entryModel as any).findUnique({
      where: { id },
    });
    console.log(`Found entry:`, entry);
    if (!entry) {
      return res.status(404).json({ message: `Entry not found.` });
    }
    return res.json(entry);
  } catch (error) {
    console.error(`Error getting glossary node by ID:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary node by ID.` });
  }
}
