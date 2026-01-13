import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateSubTypeContextController(
  req: any,
  res: any
) {
  try {
    const { subtypeId, context } = req.body;
    if (!requireFields(['subtypeId', 'context'], req.body, res)) return;

    await prisma.entrySubType.update({
      where: { id: subtypeId },
      data: { context },
    });

    return res.json({
      message: 'SubType context updated successfully.',
    });
  } catch (error) {
    console.error(`Error updating SubType context:`, error);
    return res.status(500).json({ message: `Error updating SubType context.` });
  }
}
