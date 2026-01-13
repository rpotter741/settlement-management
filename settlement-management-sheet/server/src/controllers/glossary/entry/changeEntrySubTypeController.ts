import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';
import _ from 'lodash';
import { getSubTypeCached } from './updateEntry.ts';
import generateFormSource from '../../../utils/generateFormSource.ts';
import { SubTypeGroupLink } from '../../../../../client/src/app/slice/subTypeSlice.ts';

export default async function changeEntrySubTypeController(req: any, res: any) {
  const {
    entryId,
    newSubTypeId,
  }: {
    entryId: string;
    newSubTypeId: string;
  } = req.body;
  if (!requireFields(['entryId', 'newSubTypeId'], req.body, res)) return;

  try {
    const subType = await getSubTypeCached(newSubTypeId, async () => {
      return prisma.entrySubType.findUnique({
        where: { id: newSubTypeId },
        include: {
          groups: {
            include: {
              group: {
                include: {
                  properties: {
                    include: { property: true },
                  },
                },
              },
            },
          },
        },
      });
    });

    const { allGroups, allProperties } = Object.values(subType.groups).reduce(
      (acc: { allGroups: any[]; allProperties: any[] }, groupLink: any) => {
        const { group } = groupLink;
        acc.allGroups.push(group);
        group.properties.forEach((propLink: any) => {
          acc.allProperties.push(propLink.property);
        });
        return acc;
      },
      { allGroups: [], allProperties: [] }
    );

    const entry = await prisma.glossaryEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return res
        .status(404)
        .json({ message: `Entry with id ${entryId} not found.` });
    }

    const { groups, primaryAnchorId, secondaryAnchorId } = generateFormSource(
      subType,
      allGroups,
      allProperties
    );

    const allFormerProperties: Record<string, any> = {};
    Object.values(entry.groups as Record<string, any>).forEach((group: any) => {
      Object.values(group.properties).forEach(
        (p: any) => (allFormerProperties[p.id] = p)
      );
    });
    const allNewProperties: Record<string, any> = {};
    Object.values(groups).forEach((group: any) => {
      Object.values(group.properties).forEach(
        (p: any) => (allNewProperties[p.id] = p)
      );
    });

    let primaryAnchorValue = '';
    let secondaryAnchorValue = '';

    Object.values(groups).forEach((group: any) => {
      Object.values(group.properties).forEach((property: any) => {
        if (allFormerProperties[property.id]) {
          property.value = allFormerProperties[property.id].value;
          if (property.order) {
            property.order = allFormerProperties[property.id].order;
          }
          if (primaryAnchorId === property.id) {
            primaryAnchorValue = property.value;
          }
          if (secondaryAnchorId === property.id) {
            secondaryAnchorValue = property.value;
          }
        }
      });
    });

    const updates = {
      subTypeId: newSubTypeId,
      primaryAnchorValue,
      secondaryAnchorValue,
      primaryAnchorId,
      secondaryAnchorId,
      groups,
    };

    const { updatedEntry, updatedNode } = await prisma.$transaction(
      async (tx) => {
        const updatedEntry = await tx.glossaryEntry.update({
          where: { id: entryId },
          data: updates,
        });

        const updatedNode = await tx.glossaryNode.update({
          where: { id: entryId },
          data: {
            subTypeId: newSubTypeId,
          },
        });

        return { updatedEntry, updatedNode };
      }
    );
    return res.json({
      message: `Entry updated successfully.`,
      updatedEntry,
      updatedNode,
    });
  } catch (error: any) {
    console.error(`Error updating entry for id ${entryId}:`, error);

    if (error.code === 'P2025') {
      // Prisma: record not found
      return res.status(404).json({ message: 'Entry or subtype not found' });
    }

    if (error.code === 'P2034') {
      // Prisma: transaction conflict
      return res.status(409).json({ message: 'Conflict. Please retry.' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}
