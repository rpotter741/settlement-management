import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function removeGroupsFromSubTypeController(
  req: any,
  res: any
) {
  try {
    const { linkIds, subtypeId } = req.body;
    if (!requireFields(['linkIds', 'subtypeId'], req.body, res)) return;

    await prisma.$transaction(async (prisma) => {
      await prisma.subTypeSchemaGroup.deleteMany({
        where: { id: { in: linkIds } },
      });
    });

    return res.json({
      message: 'SubType Group link deleted successfully.',
    });
  } catch (error) {
    console.error(`Error deleting SubType Group link:`, error);
    return res
      .status(500)
      .json({ message: `Error deleting SubType Group link.` });
  }
}
