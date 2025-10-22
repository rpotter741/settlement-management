import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';
import { ensure } from '../../../../../shared/utils/ensure.ts';
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

    for (const u of updates) {
      const { subTypeId, keypath, value } = u;
      if (keypath === subTypeId) {
        subType = value;
      } else {
        _.set(subType!, keypath, value);
      }
    }

    // after applying your _.set changes to subType
    const data = _.omit(subType!, ['id', 'createdAt', 'updatedAt']); // adjust keys as needed
    const cleaned = _.omitBy(data, _.isUndefined);

    const updatedSubType = await prisma.entrySubType.update({
      where: { id },
      data: cleaned,
    });

    return res.json({
      message: 'SubType updated successfully.',
      data: updatedSubType,
    });
  } catch (error) {
    console.error(`Error updating glossary:`, error);
    return res.status(500).json({ message: `Error updating glossary.` });
  }
}
