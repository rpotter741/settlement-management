import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import glossaryTypeMap from '../../../utils/glossaryTypeMap.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';
import { GlossShape } from '@prisma/client';

export default async function createNodeAndDetail(req, res) {
  try {
    const { id, name, entryType, glossaryId, parentId, version } = req.body;
    if (
      !requireFields(
        ['id', 'name', 'entryType', 'glossaryId', 'parentId'],
        req.body,
        res
      )
    )
      return;

    const entryModel = glossaryModelMap[entryType];
    if (!entryModel) {
      console.log(`Invalid entry type:`, entryType);
      return res.status(400).json({ message: `Invalid entry type.` });
    }
    const baseEntry = glossaryTypeMap[entryType];
    const contentType = (await isAdminUserId(req?.user?.id))
      ? 'OFFICIAL'
      : 'CUSTOM';
    const createdBy = req?.user?.id || 'robbiepottsdm';
    const newVersion = version ? version : baseEntry?.version || 1;
    const nodeData = {
      id,
      name,
      entryType,
      fileType: GlossShape.detail,
      glossaryId,
      parentId: parentId || null,
    };

    console.log(nodeData, 'Node data for creation');

    const entryInsert = {
      id,
      name,
      ...baseEntry,
      contentType,
      createdBy,
      version: newVersion,
      integrationState: {},
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
}
