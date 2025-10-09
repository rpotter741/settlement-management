import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateNodeSortIndices(req, res) {
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
}
