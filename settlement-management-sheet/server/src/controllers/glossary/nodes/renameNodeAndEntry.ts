import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function renameNodeAndEntry(req: any, res: any) {
  try {
    const { id, name } = req.body;
    if (!requireFields(['id', 'name'], req.body, res)) return;

    const [toLinks, fromLinks] = await prisma.$transaction([
      prisma.backlinkIndex.findMany({
        where: { targetId: id },
        select: { id: true, sourceId: true },
      }),
      prisma.backlinkIndex.findMany({
        where: { sourceId: id },
        select: { id: true, targetId: true },
      }),
    ]);

    const updatedEntry = await prisma.$transaction([
      prisma.glossaryNode.update({
        where: { id },
        data: { name },
      }),
      prisma.glossaryEntry.update({
        where: { id },
        data: { name, updatedAt: new Date() },
      }),
      prisma.backlinkIndex.updateMany({
        where: { id: { in: toLinks.map((link) => link.id) } },
        data: { toNameAtLink: name },
      }),
      prisma.backlinkIndex.updateMany({
        where: { id: { in: fromLinks.map((link) => link.id) } },
        data: { fromNameAtLink: name },
      }),
    ]);

    return res.json({ updatedEntry });
  } catch (error) {
    console.error(`Error updating entry with node:`, error);
    return res.status(500).json({ message: `Error updating entry with node.` });
  }
}
