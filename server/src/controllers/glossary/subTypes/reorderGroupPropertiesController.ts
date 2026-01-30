import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function reorderGroupPropertiesController(
  req: any,
  res: any
) {
  try {
    const { groupId, newOrder } = req.body;
    if (!requireFields(['groupId', 'newOrder'], req.body, res)) return;

    const oldOrder = await prisma.subTypeGroupProperty.findMany({
      where: { groupId },
    });

    const newOrderData = newOrder.map((propertyId: string, index: number) => ({
      id: oldOrder.find((o) => o.propertyId === propertyId)?.id!,
      order: index,
    }));

    const ops = newOrderData.map(
      ({ id, order }: { id: string; order: number }) =>
        prisma.subTypeGroupProperty.update({
          where: { id },
          data: { order },
        })
    );

    await prisma.$transaction(ops);

    return res.json({
      message: 'SubType Group properties reordered successfully.',
    });
  } catch (error) {
    console.error(`Error reordering SubType Group properties:`, error);
    return res
      .status(500)
      .json({ message: `Error reordering SubType Group properties.` });
  }
}
