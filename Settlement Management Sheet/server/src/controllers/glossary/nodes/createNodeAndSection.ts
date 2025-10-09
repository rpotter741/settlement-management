import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import glossaryTypeMap from '../../../utils/glossaryTypeMap.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function createNodeAndSection(req, res) {
  try {
    const { id, name, entryType, glossaryId, parentId, version, fileType } =
      req.body;

    if (
      !requireFields(['id', 'name', 'entryType', 'glossaryId'], req.body, res)
    )
      return;

    const contentType = 'OFFICIAL';
    const createdBy = req?.user?.id || 'robbiepottsdm';
    const newVersion = version ?? 1;

    const result = await prisma.$transaction(async (tx) => {
      const node = await tx.glossaryNode.create({
        data: {
          id,
          name,
          entryType,
          fileType,
          glossaryId,
          parentId: parentId || null,
        },
      });
      const entry = await tx.glossarySection.create({
        data: {
          id,
          name,
          entryType,
          contentType,
          createdBy,
          version: newVersion,
        },
      });

      return { node, entry };
    });

    return res.json(result);
  } catch (error) {
    console.error(`Error creating entry with node:`, error);
    return res.status(500).json({ message: `Error creating entry with node.` });
  }
}
