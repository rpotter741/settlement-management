import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function fetchSystemSubTypes(req: any, res: any) {
  try {
    const model = prisma.entrySubType;

    const subTypes = model.findMany({
      where: { contentType: 'SYSTEM' },
      orderBy: [{ updatedAt: 'asc' }],
    });

    return res.json({ subTypes });
  } catch (error) {
    console.error(`Error fetching subTypes:`, error);
    return res.status(500).json({ message: `Error fetching subTypes.` });
  }
}
