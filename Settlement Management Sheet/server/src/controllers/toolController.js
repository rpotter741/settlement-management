import prisma from '../db/db.js';

const getContent = async (req, res) => {
  try {
    const userId = req?.user?.id || 'Admin';
    const {
      tool,
      limit = 10,
      offset = 0,
      search = '',
      scope = 'personal',
    } = req.query;

    if (!tool) return res.status(400).json({ message: 'Tool type required.' });

    const model = prisma[tool];
    if (!model) return res.status(400).json({ message: 'Invalid tool type.' });

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
      select: {
        id: true,
        refId: true,
        name: true,
        description: true,
        tags: true,
        status: true,
        createdBy: true,
        contentType: true,
      },
    });

    res.json({ items, nextOffset: offset + items.length });
  } catch (error) {
    console.error(`Error getting ${scope} ${tool}:`, error);
    return res.status(500).json({ message: `Error getting ${scope} ${tool}.` });
  }
};

export { getContent };
