import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function removeGroupPropertyController(
  req: any,
  res: any
) {
  try {
    const { linkId, newGroupDisplay, groupId } = req.body;
    if (!requireFields(['linkId', 'newGroupDisplay', 'groupId'], req.body, res))
      return;

    await prisma.$transaction(async (prisma) => {
      await prisma.subTypeGroupProperty.delete({
        where: { id: linkId },
      });
      await prisma.subTypeGroup.update({
        where: { id: groupId },
        data: { display: newGroupDisplay },
      });
    });

    return res.json({
      message: 'SubType Group property link deleted successfully.',
    });
  } catch (error) {
    console.error(`Error deleting SubType Group property link:`, error);
    return res
      .status(500)
      .json({ message: `Error deleting SubType Group property link.` });
  }
}
