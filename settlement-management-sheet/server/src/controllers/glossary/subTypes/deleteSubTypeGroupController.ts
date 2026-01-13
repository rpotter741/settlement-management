import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function deleteSubTypeGroupController(req: any, res: any) {
  try {
    const { groupId } = req.body;
    if (!requireFields(['groupId'], req.body, res)) return;

    await prisma.$transaction(async (prisma) => {
      await prisma.subTypeGroupProperty.deleteMany({
        where: { groupId },
      });
      await prisma.subTypeGroup.delete({
        where: { id: groupId },
      });
    });

    return res.json({ message: 'SubType group deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting SubType group:`, error);
    return res.status(500).json({ message: `Error deleting SubType group.` });
  }
}
