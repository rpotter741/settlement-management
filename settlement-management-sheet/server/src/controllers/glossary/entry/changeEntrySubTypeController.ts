import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';
import _ from 'lodash';
import { getSubTypeCached } from './updateEntry.ts';
import generateFormSource from '../../../utils/generateFormSource.ts';

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
      });
    });
    const entry = await prisma.glossaryEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return res
        .status(404)
        .json({ message: `Entry with id ${entryId} not found.` });
    }

    const groups = generateFormSource(subType).groups;

    console.log(groups);

    const updates = {
      subTypeId: newSubTypeId,
      primaryAnchorValue: null,
      secondaryAnchorValue: null,
      primaryAnchorId: subType.anchors.primary,
      secondaryAnchorId: subType.anchors.secondary,
      groups,
    };

    const updatedEntry = await prisma.glossaryEntry.update({
      where: { id: entryId },
      data: updates,
    });

    const updatedNode = await prisma.glossaryNode.update({
      where: { id: entryId },
      data: {
        subTypeId: newSubTypeId,
      },
    });

    return res.json({
      message: `Entry updated successfully.`,
      updates,
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
