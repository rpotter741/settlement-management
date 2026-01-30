import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateSubTypeGroupController(req: any, res: any) {
  try {
    const { groupId, updates } = req.body;
    if (!requireFields(['groupId', 'updates'], req.body, res)) return;

    await prisma.subTypeGroup.update({
      where: { id: groupId },
      data: updates,
    });

    return res.json({
      message: 'SubType group updated successfully.',
    });
  } catch (error) {
    console.error(`Error updating SubType Group:`, error);
    return res.status(500).json({ message: `Error updating SubType Group.` });
  }
}
