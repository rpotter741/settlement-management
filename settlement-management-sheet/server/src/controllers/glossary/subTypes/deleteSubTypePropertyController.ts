import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function deleteSubTypePropertyController(
  req: any,
  res: any
) {
  try {
    const { propertyId } = req.body;
    if (!requireFields(['propertyId'], req.body, res)) return;

    await prisma.subTypeProperty.delete({
      where: { id: propertyId },
    });

    return res.json({ message: 'SubType property deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting SubType property:`, error);
    return res
      .status(500)
      .json({ message: `Error deleting SubType property.` });
  }
}
