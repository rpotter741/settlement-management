import prisma from '../../../db/db.ts';
import isAdminUserId from '../../../utils/isAdminUserId.ts';
import requireFields from '../../../utils/requireFields.ts';
import _ from 'lodash';

export default async function createSubTypeGroupPropertyController(
  req: any,
  res: any
) {
  try {
    const { propertyId, groupId, order } = req.body;
    if (!requireFields(['propertyId', 'groupId', 'order'], req.body, res))
      return;

    const model = prisma.subTypeGroupProperty;

    const entryData = {
      propertyId,
      groupId,
      order,
    };

    const createdProperty = await prisma.$transaction(async (tx) => ({
      property: await model.create({ data: entryData }),
      group: await tx.subTypeGroup.findUnique({
        where: { id: groupId },
      }),
    }));

    const display =
      (_.cloneDeep(createdProperty.group?.display) as Record<string, any>) ||
      ({} as Record<string, any>);
    display[createdProperty.property.id] = { columns: 4 };

    await prisma.subTypeGroup.update({
      where: { id: groupId },
      data: { display },
    });

    return res.json({
      message: 'SubType Group Property created successfully',
      createdProperty: createdProperty.property,
    });
  } catch (error) {
    console.error(`Error linking subtype property:`, error);
    return res.status(500).json({ message: `Error linking subtype property.` });
  }
}
