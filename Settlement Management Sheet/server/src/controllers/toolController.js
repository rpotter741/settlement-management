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

const saveContent = async (req, res) => {
  try {
    const userId = req?.user?.id || 'Admin';
    const { tool, data } = req.body;

    if (!tool || !data) {
      return res.status(400).json({ message: 'Tool and data are required.' });
    }

    const model = prisma[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }

    const latest = await model.findFirst({
      where: { refId: data.refId },
      orderBy: { updatedAt: 'desc' },
    });
    if (latest) {
      await model.update({
        where: { id: latest.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return res.json({ message: 'Content updated successfully.' });
    } else {
      await model.create({
        data: {
          ...data,
          createdBy: userId,
          contentType: 'OFFICIAL',
        },
      });
      return res.json({ message: 'Content saved successfully.' });
    }
  } catch (error) {
    console.error('Error saving content:', error);
    return res.status(500).json({ message: 'Error saving content.' });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { tool, refId } = req.body;
    console.log(tool, refId);

    if (!tool || !refId) {
      return res.status(400).json({ message: 'Tool and refId are required.' });
    }

    const model = prisma[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }

    await model.deleteMany({ where: { refId } });
    console.log('we did it!');
    return res.status(200).json({ message: 'Content deleted successfully.' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return res.status(500).json({ message: 'Error deleting content.' });
  }
};

const getItem = async (req, res) => {
  try {
    const { tool, id, refId } = req.query;
    console.log(tool, id, refId);
    const model = prisma[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }
    const item = await model.findUnique({ where: { id, refId } });
    console.log(item);
    res.json(item);
  } catch (error) {
    console.error('Error getting item:', error);
    return res.status(500).json({ message: 'Error getting item.' });
  }
};

export { getContent, saveContent, deleteContent, getItem };
