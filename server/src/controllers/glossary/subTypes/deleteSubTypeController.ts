import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function deleteSubType(req: any, res: any) {
  try {
    const { subTypeId } = req.body;
    if (!requireFields(['subTypeId'], req.body, res)) return;

    await prisma.entrySubType.delete({
      where: { id: subTypeId },
    });

    return res.json({ message: 'SubType deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting SubType:`, error);
    return res.status(500).json({ message: `Error deleting SubType.` });
  }
}
