import prisma from '../../db/db.ts';

//helpers
import requireFields from '../../utils/requireFields.ts';

export default async function getToolsByName(req: any, res: any) {
  try {
    const userId = req?.user?.id || 'Admin';
    const { tool, name = '' } = req.query;

    if (!requireFields(['tool'], req.query, res)) return;

    const model = (prisma as any)[tool];
    if (!model || typeof model.findMany !== 'function')
      return res.status(400).json({ message: 'Invalid tool type.' });

    const options = await model.findMany();
    const data = options
      .sort((a: any, b: any) => {
        const aIsUser = a.createdBy === userId;
        const bIsUser = b.createdBy === userId;
        if (aIsUser && !bIsUser) return -1;
        if (!aIsUser && bIsUser) return 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      })
      .filter((item: any) => {
        if (name === '') return true;
        return item.name.toLowerCase().includes(name.toLowerCase());
      });
    res.json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error getting content by name.' });
  }
}
