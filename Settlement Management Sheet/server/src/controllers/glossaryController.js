import prisma from '../db/db.js';

//helpers
import requireFields from '../utils/requireFields.js';
import glossaryTypeMap from '../utils/glossaryTypeMap.js';

const getGlossaries = async (req, res) => {
  try {
    const userId = req?.user?.id || 'robbiepottsdm';

    const glossaries = await prisma.glossary.findMany({
      where: {
        createdBy: userId,
      },
      orderBy: [{ updatedAt: 'desc' }],
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return res.json({ glossaries });
  } catch (error) {
    console.error(`Error getting glossaries:`, error);
    return res.status(500).json({ message: `Error getting glossaries.` });
  }
};

const getGlossaryById = async (req, res) => {
  try {
    const { glossaryId } = req.query;
    if (!requireFields([glossaryId], req.query, res)) return;
    const glossary = await prisma.glossary.findUnique({
      where: {
        id: glossaryId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        nodes: {
          select: {
            id: true,
            name: true,
            entryType: true,
            type: true,
            parentId: true,
            sortIndex: true,
          },
        },
      },
    });
    return res.json({ glossary });
  } catch (error) {
    console.error(`Error getting glossary:`, error);
    return res.status(500).json({ message: `Error getting glossary.` });
  }
};

const getGlossaryNodes = async (req, res) => {
  try {
    const { glossaryId } = req.query;
    if (!requireFields(['glossaryId'], req.query, res)) return;
    console.log('glossaryId', glossaryId);
    const structure = await prisma.glossaryNode.findMany({
      where: {
        glossaryId: glossaryId,
      },
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
    return res.json({ structure });
  } catch (error) {
    console.error(`Error getting glossary nodes:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary nodes, ${error}` });
  }
};

const createGlossary = async (req, res) => {
  try {
    const { id, name, description } = req.body;
    if (!requireFields(['id', 'name', 'description'], req.body, res)) return;
    const newGlossary = await prisma.glossary.create({
      data: {
        id,
        name,
        description,
        createdBy: req?.user?.id || 'robbiepottsdm',
        contentType: 'CUSTOM',
      },
    });
    return res.json({ glossary: newGlossary });
  } catch (error) {
    console.error(`Error creating glossary:`, error);
    return res.status(500).json({ message: `Error creating glossary.` });
  }
};

const renameNode = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!requireFields(['id', 'name'], req.body, res)) return;
    const updatedEntry = await prisma.glossaryNode.update({
      where: { id },
      data: { name },
    });
    return res.json({ entry: updatedEntry });
  } catch (error) {
    console.error(`Error renaming entry:`, error);
    return res.status(500).json({ message: `Error renaming entry.` });
  }
};
const deleteNode = async (req, res) => {
  try {
    const { id } = req.body;
    if (!requireFields(['id'], req.body, res)) return;

    await prisma.glossaryNode.delete({
      where: { id },
    });
    return res.json({ message: 'Entry deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting entry:`, error);
    return res.status(500).json({ message: `Error deleting entry.` });
  }
};
const createFolder = async (req, res) => {
  try {
    const { id, name, parentId, glossaryId } = req.body;
    if (!requireFields(['id', 'name', 'glossaryId'], req.body, res)) return;
    const newEntry = await prisma.glossaryNode.create({
      data: {
        id,
        name,
        entryType: null,
        type: 'folder',
        parentId,
        glossaryId,
      },
    });
    return res.json({ entry: newEntry });
  } catch (error) {
    console.error(`Error creating entry:`, error);
    return res.status(500).json({ message: `Error creating entry.` });
  }
};

const createEntryWithNode = async (req, res) => {
  try {
    const { id, name, entryType, type, glossaryId, parentId, entryData } =
      req.body;
    const entryModel = prisma[entryType];
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
    const { id, entryType } = req.body;
    const entryModel = prisma[entryType];
    if (!entryModel) {
      return res.status(400).json({ message: `Invalid entry type.` });
    }
    if (!requireFields(['id', 'entryType'], req.body, res)) return;

    await prisma.$transaction([
      prisma.glossaryNode.delete({ where: { id } }),
      entryModel.delete({ where: { id } }),
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
    const entryModel = prisma[entryType];
    if (!model) {
      return res.status(400).json({ message: `Invalid entry type.` });
    }
    if (!requireFields(['id', 'entryType', 'entryData'], req.body, res)) return;

    const updatedEntry = await prisma.$transaction([
      prisma.glossaryNode.update({
        where: { id },
        data: { name: entryData.name },
      }),
      entryModel.update({
        where: { id },
        data: { ...entryData },
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
      prisma.glossaryNode.update({
        where: { id },
        data: { sortIndex },
      })
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
    await prisma.glossary.delete({
      where: { id },
    });
    return res.json({ message: 'Glossary deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting glossary:`, error);
    return res.status(500).json({ message: `Error deleting glossary.` });
  }
};

export {
  getGlossaries,
  getGlossaryById,
  getGlossaryNodes,
  createGlossary,
  renameNode,
  deleteNode,
  createFolder,
  updateNode,
  updateNodeSortIndexes,
  updateNodeParentId,
  updateGlossary,
  deleteGlossary,
  createEntryWithNode,
  deleteEntryWithNode,
  updateEntryWithNode,
};
