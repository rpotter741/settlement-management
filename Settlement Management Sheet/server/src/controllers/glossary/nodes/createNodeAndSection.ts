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
    const entryModel = prisma.glossarySection;
    const contentType = 'OFFICIAL';
    const createdBy = req?.user?.id || 'robbiepottsdm';
    const newVersion = version ?? 1;

    const geography = await prisma.glossaryGeography.create({
      data: { id, version: 1 },
    });
    const political = await prisma.glossaryPolitical.create({
      data: { id, version: 1 },
    });
    const relationships = await prisma.glossaryRelationships.create({
      data: { id, version: 1 },
    });
    const history = await prisma.glossaryHistory.create({
      data: { id, version: 1 },
    });

    const nodeData = {
      id,
      name,
      entryType,
      fileType,
      glossaryId,
      parentId: parentId || null,
    };

    const entryInsert = {
      id,
      name,
      entryType,
      contentType,
      createdBy,
      geographyId: geography.id,
      politicalId: political.id,
      relationshipsId: relationships.id,
      historyId: history.id,
      version: newVersion,
      integrationState: {},
    };

    const [node, entry] = await prisma.$transaction([
      prisma.glossaryNode.create({ data: nodeData }),
      // @ts-ignore
      entryModel.create({ data: entryInsert }),
    ]);

    return res.json({ node, entry });
  } catch (error) {
    console.error(`Error creating entry with node:`, error);
    return res.status(500).json({ message: `Error creating entry with node.` });
  }
}
