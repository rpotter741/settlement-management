import prisma from '../../db/db.ts';

//helpers
import requireFields from '../../utils/requireFields.ts';

export default async function fetchByIds(req: any, res: any) {
  try {
    const { tool, ids } = req.body;
    if (!requireFields(['tool', 'ids'], req.body, res)) return;
    const model = (prisma as any)[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }
    const items = await model.findMany({ where: { id: { in: ids } } });
    res.json(items);
  } catch (error) {
    console.error('Error getting items by ids:', error);
    return res.status(500).json({ message: 'Error getting items by ids.' });
  }
}
