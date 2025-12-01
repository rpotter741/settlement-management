import prisma from '../../../db/db.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';
import { generateFormSource } from '../../../../../client/src/features/Glossary/utils/generatePropertyValue.ts';

export default async function createNodeAndEntry(req: any, res: any) {
  try {
    const { entryData } = req.body;
    if (!requireFields(['entryData'], req.body, res)) return;

    const contentType = 'SYSTEM';
    const createdBy = req?.user?.id || 'robbiepottsdm';

    const subTypeShape = await prisma.entrySubType.findFirst({
      where: {
        id: entryData.subTypeId,
      },
    });

    const source: any = generateFormSource(subTypeShape);

    const { groups } = source;
    if (!groups) {
      console.error(
        'No groups found in source for subTypeId:',
        entryData.subTypeId
      );
      return res
        .status(400)
        .json({ message: 'Invalid subTypeId, no groups found.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const node = await tx.glossaryNode.create({
        data: {
          id: entryData.id,
          name: entryData.name,
          entryType: entryData.entryType,
          fileType: entryData.fileType,
          glossaryId: entryData.glossaryId,
          parentId: entryData.parentId || null,
          subTypeId: entryData.subTypeId,
        },
      });
      const entry = await tx.glossaryEntry.create({
        data: {
          id: entryData.id,
          name: entryData.name,
          format: entryData.fileType,
          entryType: entryData.entryType,
          contentType,
          createdBy,
          version: 1,
          groups,
          subTypeId: entryData.subTypeId,
          primaryAnchorId: source.primaryAnchorId,
          secondaryAnchorId: source.secondaryAnchorId,
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
