import prisma from '../../db/db.ts';

//helpers
import requireFields from '../../utils/requireFields.ts';

export default async function deleteTool(req: any, res: any) {
  try {
    const { tool, id } = req.body;

    if (!requireFields(['tool', 'id'], req.body, res)) return;

    const model = (prisma as any)[tool];
    if (!model || typeof model.delete !== 'function') {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }

    await model.delete({ where: { id } });
    return res.status(200).json({ message: 'Content deleted successfully.' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return res.status(500).json({ message: 'Error deleting content.' });
  }
}
