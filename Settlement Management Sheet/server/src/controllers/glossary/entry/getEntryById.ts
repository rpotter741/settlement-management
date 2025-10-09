import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function getEntryById(req: any, res: any) {
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
      select: {
        refId: true,
        id: true,
        version: true,
        contentType: true,
        entryType: true,
        createdBy: true,
        forkedBy: true,
        collaborators: true,
        editors: true,
        subType: true,
        name: true,
        description: true,
        dataString: true,
        tags: true,
        subSections: true,
        customTabIds: true,
        custom: true,
        integrationState: true,
        backlinksFrom: true,
        backlinksTo: true,
      },
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
