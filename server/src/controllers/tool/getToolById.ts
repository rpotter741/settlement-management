import prisma from '../../db/db.ts';

//helpers
import requireFields from '../../utils/requireFields.ts';

export default async function getToolById(req: any, res: any) {
  try {
    const { tool, id, refId } = req.query;
    if (!requireFields(['tool', 'id', 'refId'], req.query, res)) return;
    const model = (prisma as any)[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }
    const item = await model.findUnique({ where: { id, refId } });
    res.json(item);
  } catch (error) {
    console.error('Error getting item:', error);
    return res.status(500).json({ message: 'Error getting item.' });
  }
}
