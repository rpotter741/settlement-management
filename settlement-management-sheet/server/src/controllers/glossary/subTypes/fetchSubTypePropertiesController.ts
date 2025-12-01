import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function fetchSubTypePropertiesController(
  req: any,
  res: any
) {
  try {
    const userId = req?.user?.id || 'robbiepottsdm';
    const system = req.params.system === 'true' ? true : false;

    const model = prisma.subTypeProperty;

    const where = system
      ? { OR: [{ createdBy: userId }, { contentType: 'SYSTEM' }] }
      : { createdBy: userId };

    const properties = await model.findMany({
      //@ts-ignore
      where,
      orderBy: [{ updatedAt: 'asc' }],
    });

    // separate by type
    const userProperties =
      properties.filter((p) => p.createdBy === userId) ?? [];
    const systemProperties =
      properties.filter((p) => p.contentType === 'SYSTEM') ?? [];

    return res.json({
      properties: system
        ? { ...userProperties, ...systemProperties }
        : userProperties,
    });
  } catch (error) {
    console.error(`Error fetching properties:`, error);
    return res.status(500).json({ message: `Error fetching properties.` });
  }
}
