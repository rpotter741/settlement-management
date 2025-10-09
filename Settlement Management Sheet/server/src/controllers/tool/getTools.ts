import prisma from '../../db/db.ts';

//helpers
import getValidDependencies from '../../utils/getValidDependencies.ts';
import toolSelectMap from '../..//utils/toolSelectMap.ts';
import requireFields from '../../utils/requireFields.ts';

export default async function getTools(req: any, res: any) {
  try {
    const userId = req?.user?.id || 'Admin';
    const {
      tool,
      limit = 10,
      offset = 0,
      search = '',
      scope = 'personal',
      dependency,
      depId,
    } = req.query;

    if (!requireFields(['tool'], req.query, res)) return;

    const model = (prisma as any)[tool];
    if (!model || typeof model.findMany !== 'function')
      return res.status(400).json({ message: 'Invalid tool type.' });

    const whereClause = {
      name: { contains: search, mode: 'insensitive' },
      ...(scope === 'personal'
        ? { createdBy: userId }
        : { NOT: { createdBy: userId } }),
    };

    const items = await model.findMany({
      where: whereClause,
      distinct: ['refId'],
      orderBy: [{ updatedAt: 'desc' }],
      take: parseInt(limit),
      skip: parseInt(offset),
      select: toolSelectMap[tool as keyof typeof toolSelectMap] || {},
    });
    if (dependency === 'true') {
      console.log("shit's true!");
      const validDependencies = await getValidDependencies(items, depId);
      return res.json({
        items: validDependencies,
        nextOffset: offset + validDependencies.length,
      });
    } else {
      res.json({ items, nextOffset: offset + items.length });
    }
  } catch (error) {
    console.error(`Error getting :`, error);
    return res
      .status(500)
      .json({ message: `Error getting content. Try again later.` });
  }
}
