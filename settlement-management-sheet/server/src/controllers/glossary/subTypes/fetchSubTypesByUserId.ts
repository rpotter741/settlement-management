import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function fetchSubTypesByUserId(req: any, res: any) {
  try {
    const userId = req?.user?.id || 'robbiepottsdm';
    const system = req.params.system === 'true' ? true : false;

    const model = prisma.entrySubType;

    const where = system
      ? { OR: [{ createdBy: userId }, { contentType: 'SYSTEM' }] }
      : { createdBy: userId };

    const subTypes = await model.findMany({
      //@ts-ignore
      where,
      orderBy: [{ updatedAt: 'asc' }],
      include: {
        groups: true,
        entries: { select: { id: true } },
        glossaries: { select: { id: true } },
      },
    });

    // if you need them separated (like your original code), partition:
    const userSubTypes = subTypes.filter((s) => s.createdBy === userId);
    const systemSubTypes = subTypes.filter((s) => s.contentType === 'SYSTEM');

    // or if you want a single deduped array:
    // const combined = Array.from(new Map(subTypes.map(s => [s.id, s])).values());

    return res.json({
      subTypes: system ? { ...userSubTypes, ...systemSubTypes } : userSubTypes,
    });
  } catch (error) {
    console.error(`Error fetching subTypes:`, error);
    return res.status(500).json({ message: `Error fetching subTypes.` });
  }
}
