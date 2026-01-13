import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';
import _ from 'lodash';

export default async function batchUpdateSubType(req: any, res: any) {
  try {
    const { id, updates } = req.body;
    if (!requireFields(['id', 'updates'], req.body, res)) return;
    const subTypeArray = await prisma.entrySubType.findUnique({
      where: { id },
    });
    let subType = subTypeArray ? _.cloneDeep(subTypeArray) : null;
    if (!subType) {
      return res.status(404).json({ message: 'SubType not found.' });
    }

    let anchorUpdate = false;
    let primaryId = '';
    let secondaryId = '';

    let entries; // to hold entries if there are anchor updates -- see below baby!

    for (const u of updates) {
      const { subTypeId, keypath, value } = u;
      const usableKeypath = keypath.split('.').slice(1).join('.');
      if (keypath.includes('anchors.primary')) {
        anchorUpdate = true;
        primaryId = value;
      }
      if (keypath.includes('anchors.secondary')) {
        anchorUpdate = true;
        secondaryId = value;
      }
      if (keypath === subTypeId) {
        subType = value;
      } else {
        _.set(subType!, usableKeypath, value);
      }
    }

    // after applying your _.set changes to subType
    const data = _.omit(subType!, ['id', 'createdAt', 'updatedAt']); // adjust keys as needed
    const cleaned = _.omitBy(data, _.isUndefined);

    // this is the workaround for prisma not supporting ternaries in transactional updates
    const ops = [];

    ops.push(
      prisma.entrySubType.update({
        where: { id },
        data: cleaned,
      })
    );

    if (anchorUpdate) {
      entries = await prisma.glossaryEntry.findMany({
        where: { subTypeId: id },
      });
    }

    if (anchorUpdate && entries && entries.length) {
      // For each entry push an individual update so we can set per-entry anchor values
      for (const e of entries) {
        const data: any = {};

        // If a new primary anchor id was provided, set it and compute the value at that keypath for this entry
        if (primaryId !== '') {
          data.primaryAnchorId = primaryId;
          // primaryKeypath is expected to be a keypath within the entry (e.g. "groups.someKey")
          const primaryVal = primaryId ? _.get(e, primaryId) : null;
          data.primaryAnchorValue = (primaryVal?.value || primaryVal) ?? null;
        }

        // Same for secondary
        if (secondaryId !== '') {
          data.secondaryAnchorId = secondaryId;
          const secondaryVal = secondaryId ? _.get(e, secondaryId) : null;
          data.secondaryAnchorValue =
            (secondaryVal?.value || secondaryVal) ?? null;
        }

        // Only push an update op if there's something to update
        if (Object.keys(data).length) {
          ops.push(
            prisma.glossaryEntry.update({
              where: { id: e.id },
              data,
            })
          );
        }
      }
    }

    await prisma.$transaction(ops);

    return res.json({
      message: 'SubType updated successfully.',
    });
  } catch (error) {
    console.error(`Error updating glossary:`, error);
    return res.status(500).json({ message: `Error updating glossary.`, error });
  }
}
