import prisma from '../db/db.js';

//helpers
import getNextVersion from '../utils/getNextVersion.js';

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
      where: { id: data.id },
      orderBy: { updatedAt: 'desc' },
    });

    if (latest) {
      if (latest.status === 'PUBLISHED') {
        // Create a new draft version
        const version = await getNextVersion(model, data.id);
        await model.create({
          data: {
            ...data,
            version,
            status: 'DRAFT',
            createdBy: userId,
            contentType: 'OFFICIAL',
          },
        });
        return res.json({ message: 'New draft version created.' });
      } else {
        // Update the existing draft version
        await model.update({
          where: { refId: latest.refId },
          data: {
            ...data,
            updatedAt: new Date(),
          },
        });
        return res.json({ message: 'Draft updated successfully.' });
      }
    } else {
      // Create brand new object
      await model.create({
        data: {
          ...data,
          version: 1,
          createdBy: userId,
          contentType: 'OFFICIAL',
        },
      });
      return res.json({ message: 'Content created successfully.' });
    }
  } catch (error) {
    console.error('Error saving content:', error);
    return res.status(500).json({ message: 'Error saving content.' });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { tool, id } = req.body;

    if (!tool || !id) {
      return res.status(400).json({ message: 'Tool and refId are required.' });
    }

    const model = prisma[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }

    await model.deleteMany({ where: { id } });
    return res.status(200).json({ message: 'Content deleted successfully.' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return res.status(500).json({ message: 'Error deleting content.' });
  }
};

const getItem = async (req, res) => {
  try {
    const { tool, id, refId } = req.query;
    const model = prisma[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }
    const item = await model.findUnique({ where: { id, refId } });
    res.json(item);
  } catch (error) {
    console.error('Error getting item:', error);
    return res.status(500).json({ message: 'Error getting item.' });
  }
};

const fetchByIds = async (req, res) => {
  try {
    const { tool, ids } = req.body;
    const model = prisma[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }
    const items = await model.findMany({ where: { id: { in: ids } } });
    res.json(items);
  } catch (error) {
    console.error('Error getting items by ids:', error);
    return res.status(500).json({ message: 'Error getting items by ids.' });
  }
};

export { getContent, saveContent, deleteContent, getItem, fetchByIds };
