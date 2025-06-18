import prisma from '../db/db.ts';

//helpers
import requireFields from '../utils/requireFields.ts';
import glossaryTypeMap from '../utils/glossaryTypeMap.ts';
import glossaryModelMap from '../utils/glossaryModelMap.ts';
import collectEntriesByTypeFromFlat from '../utils/collectEntriesByType.ts';
import modelUpdateKeys from '../utils/modelKeys.ts';

const getGlossaries = async (req, res) => {
  try {
    const userId = req?.user?.id || 'robbiepottsdm';

    const glossaries = await prisma.glossary.findMany({
      where: { createdBy: userId },
      orderBy: [{ updatedAt: 'desc' }],
      select: { id: true, name: true, description: true },
    });
    return res.json({ glossaries });
  } catch (error) {
    console.error(`Error getting glossaries:`, error);
    return res.status(500).json({ message: `Error getting glossaries.` });
  }
};

const getGlossaryNodes = async (req, res) => {
  try {
    const { glossaryId } = req.query;
    if (!requireFields(['glossaryId'], req.query, res)) return;
    const structure = await prisma.glossaryNode.findMany({
      where: { glossaryId: glossaryId },
      orderBy: [{ sortIndex: 'asc' }],
      select: {
        id: true,
        name: true,
        entryType: true,
        type: true,
        parentId: true,
        sortIndex: true,
        glossaryId: true,
      },
    });
    return res.json({ structure });
  } catch (error) {
    console.error(`Error getting glossary nodes:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary nodes, ${error}` });
  }
};

const getGlossaryEntryById = async (req, res) => {
  try {
    const { id, entryType } = req.query;
    if (!requireFields(['id', 'entryType'], req.query, res)) return;
    const entryModel = glossaryModelMap[entryType];
    if (!entryModel) {
      console.log(`Invalid entry type:`, entryType);
      return res.status(400).json({ message: `Invalid entry type.` });
    }
    const entry = await entryModel.findUnique({
      where: { id },
    });
    if (!entry) {
      return res.status(404).json({ message: `Entry not found.` });
    }
    return res.json({ entry });
  } catch (error) {
    console.error(`Error getting glossary node by ID:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary node by ID.` });
  }
};

const createGlossary = async (req, res) => {
  try {
    const { id, name, description, theme = 'default' } = req.body;
    if (!requireFields(['id', 'name', 'description'], req.body, res)) return;
    const newGlossary = await prisma.glossary.create({
      data: {
        id,
        name,
        description,
        createdBy: req?.user?.id || 'robbiepottsdm',
        contentType: 'CUSTOM',
        theme,
      },
    });
    return res.json({ glossary: newGlossary });
  } catch (error) {
    console.error(`Error creating glossary:`, error);
    return res.status(500).json({ message: `Error creating glossary.` });
  }
};

const createEntryWithNode = async (req, res) => {
  try {
    const { id, name, entryType, type, glossaryId, parentId, version } =
      req.body;
    const entryModel = glossaryModelMap[entryType];
    if (!entryModel) {
      console.log(`Invalid entry type:`, entryType);
      return res.status(400).json({ message: `Invalid entry type.` });
    }
    if (
      !requireFields(
        ['id', 'name', 'entryType', 'type', 'glossaryId'],
        req.body,
        res
      )
    )
      return;

    const baseEntry = glossaryTypeMap[entryType];
    const contentType = baseEntry?.contentType || 'CUSTOM';
    const createdBy = req?.user?.id || 'robbiepottsdm';
    const newVersion = version ? version : baseEntry?.version || 1;

    const nodeData = {
      id,
      name,
      entryType,
      type,
      glossaryId,
      parentId: parentId || null,
    };

    const entryInsert = {
      id,
      name,
      ...baseEntry,
      contentType,
      createdBy,
      version: newVersion,
    };

    const [node, entry] = await prisma.$transaction([
      prisma.glossaryNode.create({ data: nodeData }),
      entryModel.create({ data: entryInsert }),
    ]);

    return res.json({ node, entry });
  } catch (error) {
    console.error(`Error creating entry with node:`, error);
    return res.status(500).json({ message: `Error creating entry with node.` });
  }
};

const deleteEntryWithNode = async (req, res) => {
  try {
    const { id, entryType, glossaryId } = req.body;
    const entryModel = glossaryModelMap[entryType];
    if (!entryModel) {
      return res.status(400).json({ message: `Invalid entry type.` });
    }
    if (!requireFields(['id', 'entryType', 'glossaryId'], req.body, res))
      return;

    const structure = await prisma.glossaryNode.findMany({
      where: { glossaryId: glossaryId },
      orderBy: [{ sortIndex: 'asc' }],
      select: {
        id: true,
        name: true,
        entryType: true,
        type: true,
        parentId: true,
        sortIndex: true,
      },
    });

    const idsByType = collectEntriesByTypeFromFlat(id, structure);

    await prisma.$transaction([
      prisma.glossaryNode.delete({ where: { id } }),
      ...Object.entries(idsByType).flatMap(([type, ids]) => {
        const model = glossaryModelMap[type];
        return model ? [model.deleteMany({ where: { id: { in: ids } } })] : [];
      }),
    ]);
    return res.json({ message: 'Entry and node deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting entry with node:`, error);
    return res.status(500).json({ message: `Error deleting entry with node.` });
  }
};

const updateEntryWithNode = async (req, res) => {
  try {
    const { id, entryType, entryData } = req.body;
    const entryModel = glossaryModelMap[entryType];
    if (!entryModel) {
      return res.status(400).json({ message: `Invalid entry type.` });
    }
    if (!requireFields(['id', 'entryType', 'entryData'], req.body, res)) return;

    const updatedEntry = await prisma.$transaction([
      prisma.glossaryNode.update({
        where: { id },
        data: entryData?.name ? { name: entryData.name } : {},
      }),
      entryModel.update({
        where: { id },
        data: { ...entryData, updatedAt: new Date() },
      }),
    ]);

    return res.json({ updatedEntry });
  } catch (error) {
    console.error(`Error updating entry with node:`, error);
    return res.status(500).json({ message: `Error updating entry with node.` });
  }
};

const updateNode = async (req, res) => {
  try {
    const { id, name, type, parentId } = req.body;
    if (!requireFields(['id', 'name', 'type'], req.body, res)) return;
    const updatedEntry = await prisma.glossaryNode.update({
      where: { id },
      data: { name, type, parentId },
    });
    return res.json({ entry: updatedEntry });
  } catch (error) {
    console.error(`Error updating entry:`, error);
    return res.status(500).json({ message: `Error updating entry.` });
  }
};
const updateNodeSortIndexes = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!requireFields(['updates'], req.body, res)) return;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Invalid update payload.' });
    }
    for (const { id, sortIndex } of updates) {
      if (!id || typeof sortIndex !== 'number') {
        return res
          .status(400)
          .json({ message: 'Each entry must have id and sortIndex.' });
      }
    }

    const ops = updates.map(({ id, sortIndex }) =>
      prisma.glossaryNode.update({ where: { id }, data: { sortIndex } })
    );

    const result = await prisma.$transaction(ops);
    return res.json({
      message: 'Entries updated successfully.',
      updated: result,
    });
  } catch (error) {
    console.error(`Batch update failed:`, error);
    return res
      .status(500)
      .json({ message: `Batch update failed`, error: error.message });
  }
};
const updateNodeParentId = async (req, res) => {
  try {
    const { id, parentId } = req.body;
    if (!requireFields(['id', 'parentId'], req.body, res)) return;
    const updatedEntry = await prisma.glossaryNode.update({
      where: { id },
      data: { parentId },
    });
    return res.json({ entry: updatedEntry });
  } catch (error) {
    console.error(`Error updating entry parent ID:`, error);
    return res.status(500).json({ message: `Error updating entry parent ID.` });
  }
};
const updateGlossary = async (req, res) => {
  try {
    const { id, name, description } = req.body;
    if (!requireFields(['id', 'name', 'description'], req.body, res)) return;
    const updatedGlossary = await prisma.glossary.update({
      where: { id },
      data: { name, description },
    });
    return res.json({ glossary: updatedGlossary });
  } catch (error) {
    console.error(`Error updating glossary:`, error);
    return res.status(500).json({ message: `Error updating glossary.` });
  }
};
const deleteGlossary = async (req, res) => {
  try {
    const { id } = req.body;
    if (!requireFields(['id'], req.body, res)) return;

    const structure = await prisma.glossaryNode.findMany({
      where: { glossaryId: id },
      orderBy: [{ sortIndex: 'asc' }],
      select: {
        id: true,
        name: true,
        entryType: true,
        type: true,
        parentId: true,
        sortIndex: true,
      },
    });

    const onlyTops = structure.filter((node) => !node.parentId);

    const idsByType = onlyTops.reduce((acc, node) => {
      const nodeChildrenIds = collectEntriesByTypeFromFlat(node.id, structure);
      Object.entries(nodeChildrenIds).forEach(([type, ids]) => {
        if (!acc[type]) acc[type] = [];
        acc[type].push(...ids);
      });
      return acc;
    }, {});

    await prisma.$transaction([
      prisma.glossary.delete({ where: { id } }),
      ...Object.entries(idsByType).flatMap(([type, ids]) => {
        const model = glossaryModelMap[type];
        return model ? [model.deleteMany({ where: { id: { in: ids } } })] : [];
      }),
    ]);

    return res.json({ message: 'Glossary deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting glossary:`, error);
    return res.status(500).json({ message: `Error deleting glossary.` });
  }
};

export {
  getGlossaries,
  getGlossaryNodes,
  getGlossaryEntryById,
  createGlossary,
  updateNode,
  updateNodeSortIndexes,
  updateNodeParentId,
  updateGlossary,
  deleteGlossary,
  createEntryWithNode,
  deleteEntryWithNode,
  updateEntryWithNode,
};
