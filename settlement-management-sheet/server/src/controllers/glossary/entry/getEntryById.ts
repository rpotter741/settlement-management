import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';
import { validateDocumentShape } from './getEntriesById.ts';
import _ from 'lodash';

export default async function getEntryById(req: any, res: any) {
  try {
    const { id } = req.query;
    if (!requireFields(['id'], req.query, res)) return;
    const result = await prisma.$transaction(async (tx) => {
      const entry = await tx.glossaryEntry.findUnique({
        where: { id },
        include: {
          subType: {
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
          },
        },
      });
      const backlinksTo = await tx.backlinkIndex.findMany({
        where: { targetId: id },
      });
      const backlinksFrom = await tx.backlinkIndex.findMany({
        where: { sourceId: id },
      });
      return { entry, backlinksTo, backlinksFrom };
    });

    if (!result.entry) {
      return res.status(404).json({ message: `Entry not found.` });
    }

    const { backlinksTo, backlinksFrom } = result;
    const validShape = validateDocumentShape(
      result.entry,
      result.entry.subType
    );
    if (validShape) {
      if (
        validShape.newPropertyCount > 0 ||
        validShape.deletedPropertyCount > 0
      ) {
        // only update groups and anchor values
        const { groups, primaryAnchorValue, secondaryAnchorValue } =
          validShape.source;

        await prisma.glossaryEntry.update({
          where: { id: result.entry.id },
          data: {
            groups: groups as any,
            primaryAnchorValue: primaryAnchorValue as any,
            secondaryAnchorValue: secondaryAnchorValue as any,
          },
        });
      }
      const returnedEntry = _.cloneDeep(validShape.source);
      delete returnedEntry.subType;
      res.json({
        entry: returnedEntry,
        backlinksTo,
        backlinksFrom,
        newPropertyCount: validShape.newPropertyCount,
        deletedPropertyCount: validShape.deletedPropertyCount,
      });
    } else {
      return res.status(500).json({ message: 'Error validating entry shape.' });
    }
  } catch (error) {
    console.error(`Error getting glossary node by ID:`, error);
    return res
      .status(500)
      .json({ message: `Error getting glossary node by ID.`, error });
  }
}
