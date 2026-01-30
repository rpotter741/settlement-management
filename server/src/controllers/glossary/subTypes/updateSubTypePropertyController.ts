import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateSubTypePropertyController(
  req: any,
  res: any
) {
  try {
    const { propertyId, updates } = req.body;
    if (!requireFields(['propertyId', 'updates'], req.body, res)) return;

    await prisma.subTypeProperty.update({
      where: { id: propertyId },
      data: updates,
    });

    return res.json({
      message: 'SubType property updated successfully.',
    });
  } catch (error) {
    console.error(`Error updating SubType Property:`, error);
    return res
      .status(500)
      .json({ message: `Error updating SubType Property.` });
  }
}
