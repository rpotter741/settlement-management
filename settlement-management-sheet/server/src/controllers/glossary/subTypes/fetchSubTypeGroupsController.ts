import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function fetchSubTypeGroupsController(req: any, res: any) {
  try {
    const userId = req?.user?.id || 'robbiepottsdm';
    const system = req.params.system === 'true' ? true : false;

    const model = prisma.subTypeGroup;

    const where = system
      ? { OR: [{ createdBy: userId }, { contentType: 'SYSTEM' }] }
      : { createdBy: userId };

    const groups = await model.findMany({
      //@ts-ignore
      where,
      orderBy: [{ updatedAt: 'asc' }],
      include: {
        properties: true,
        schemaGroups: true,
      },
    });

    // separate by type
    const userGroups = groups.filter((p) => p.createdBy === userId) ?? [];
    const systemGroups = groups.filter((p) => p.contentType === 'SYSTEM') ?? [];

    console.log('Fetched groups:', groups);

    return res.json({
      groups: system ? { ...userGroups, ...systemGroups } : userGroups,
    });
  } catch (error) {
    console.error(`Error fetching groups:`, error);
    return res.status(500).json({ message: `Error fetching groups.` });
  }
}
