import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';

export default async function renameNodeAndEntry(req, res) {
  try {
    const { id, entryType, fileType, name } = req.body;
    if (!requireFields(['id', 'entryType', 'fileType', 'name'], req.body, res))
      return;
    const entryModel =
      fileType === 'detail'
        ? glossaryModelMap[entryType]
        : prisma.glossarySection;
    if (!entryModel) {
      return res.status(400).json({ message: `Invalid entry type.` });
    }

    const updatedEntry = await prisma.$transaction([
      prisma.glossaryNode.update({
        where: { id },
        data: { name },
      }),
      entryModel.update({
        where: { id },
        data: { name, updatedAt: new Date() },
      }),
    ]);

    return res.json({ updatedEntry });
  } catch (error) {
    console.error(`Error updating entry with node:`, error);
    return res.status(500).json({ message: `Error updating entry with node.` });
  }
}
