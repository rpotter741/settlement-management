import prisma from '../db/db.js';

const getUserCategories = async (req, res) => {
  try {
    let userId = req?.user?.id || 'Admin';
    const { limit = 10, offset = 0, search = '' } = req.query;

    const categories = await prisma.category.findMany({
      where: {
        createdBy: userId,
        name: { contains: search, mode: 'insensitive' },
      },
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
      },
    });

    res.json({ items: categories, nextOffset: offset + categories.length });
  } catch (error) {
    console.error('Error getting personal categories:', error);
    return res
      .status(500)
      .json({ message: 'Error getting personal categories.' });
  }
};
