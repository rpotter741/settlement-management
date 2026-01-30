import prisma from '../../../db/db.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';
import { generateFormSource } from '../../../../../client/src/features/Glossary/utils/generatePropertyValue.ts';
import capitalize from '../../../utils/capitalize.ts';

export default async function createNodeAndEntry(req: any, res: any) {
  try {
    const { entryData } = req.body;
    if (!requireFields(['entryData'], req.body, res)) return;

    const contentType = 'SYSTEM';
    const createdBy = req?.user?.id || 'robbiepottsdm';

    let raw;

    if (entryData.subTypeId === '') {
      raw = await prisma.entrySubType.findFirst({
        where: { name: `Generic ${capitalize(entryData.entryType)}` },
        include: {
          groups: {
            include: {
              group: {
                include: {
                  properties: {
                    include: {
                      property: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      raw = await prisma.entrySubType.findUnique({
        where: {
          id: entryData.subTypeId,
        },
        include: {
          groups: {
            include: {
              group: {
                include: {
                  properties: {
                    include: {
                      property: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    if (!raw) {
      console.error('No subtype found for ID:', entryData.subTypeId);
      return res
        .status(400)
        .json({ message: 'Invalid subTypeId, subtype not found.' });
    }

    const subTypeGroups = raw?.groups.map((g) => g.group) || [];
    const properties = subTypeGroups.flatMap((group) =>
      group.properties.map((p) => p.property)
    );

    const source: any = generateFormSource(raw!, subTypeGroups, properties);

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
          subTypeId: raw.id,
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
          subTypeId: raw.id,
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
