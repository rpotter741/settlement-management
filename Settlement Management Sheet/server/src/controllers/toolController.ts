import prisma from '../db/db.ts';

//helpers
import getNextVersion from '../utils/getNextVersion.ts';
import getValidDependencies from '../utils/getValidDependencies.ts';
import toolSelectMap from '../utils/toolSelectMap.ts';
import requireFields from '../utils/requireFields.ts';

const getContent = async (req, res) => {
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

    console.log(tool, 'tool');

    if (!requireFields(['tool'], req.query, res)) return;

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
      select: toolSelectMap[tool],
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
    return res.status(500).json({ message: `Error getting ${scope} ${tool}.` });
  }
};

const getContentByName = async (req, res) => {
  try {
    const userId = req?.user?.id || 'Admin';
    const { tool, name = '' } = req.query;

    if (!requireFields(['tool'], req.query, res)) return;

    const model = prisma[tool];
    if (!model) return res.status(400).json({ message: 'Invalid tool type.' });

    const options = await model.findMany();
    const data = options
      .sort((a, b) => {
        const aIsUser = a.createdBy === userId;
        const bIsUser = b.createdBy === userId;
        if (aIsUser && !bIsUser) return -1;
        if (!aIsUser && bIsUser) return 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      })
      .filter((item) => {
        if (name === '') return true;
        return item.name.toLowerCase().includes(name.toLowerCase());
      });
    res.json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error getting content by name.' });
  }
};

const saveContent = async (req, res) => {
  try {
    const userId = req?.user?.id || 'Admin';
    const { tool, data } = req.body;

    if (!requireFields(['tool', 'data'], req.body, res)) return;

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
          data: { ...data, updatedAt: new Date() },
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

    if (!requireFields(['tool', 'id'], req.body, res)) return;

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
    if (!requireFields(['tool', 'id', 'refId'], req.query, res)) return;
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
    if (!requireFields(['tool', 'ids'], req.body, res)) return;
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

const checkKey = async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ exists: false });

  const key = await prisma.key.findUnique({ where: { name } });
  if (key) {
    return res.json({ exists: true, key });
  } else {
    return res.json({ exists: false });
  }
};

export {
  getContent,
  getContentByName,
  saveContent,
  deleteContent,
  getItem,
  fetchByIds,
  checkKey,
};
