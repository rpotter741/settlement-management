import prisma from '../../../db/db.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';
import _ from 'lodash';

export default async function addGroupsToSubTypeController(req: any, res: any) {
  try {
    const { groupId, subtypeId, order } = req.body;
    if (!requireFields(['groupId', 'subtypeId', 'order'], req.body, res))
      return;

    const model = prisma.subTypeSchemaGroup;

    const entryData = {
      groupId,
      schemaId: subtypeId,
      order,
    };

    const groupLink = await model.create({ data: entryData });

    return res.json({
      message: 'SubType Group Link created successfully',
      groupLink,
    });
  } catch (error) {
    console.error(`Error linking subtype group:`, error);
    return res.status(500).json({ message: `Error linking subtype group.` });
  }
}
