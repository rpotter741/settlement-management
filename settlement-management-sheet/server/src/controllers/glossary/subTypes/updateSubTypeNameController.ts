import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateSubTypeNameController(req: any, res: any) {
  try {
    const { subtypeId, name } = req.body;
    if (!requireFields(['subtypeId', 'name'], req.body, res)) return;

    await prisma.entrySubType.update({
      where: { id: subtypeId },
      data: { name },
    });

    return res.json({
      message: 'SubType name updated successfully.',
    });
  } catch (error) {
    console.error(`Error updating SubType name:`, error);
    return res.status(500).json({ message: `Error updating SubType name.` });
  }
}
