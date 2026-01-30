import prisma from '../../db/db.ts';

//helpers
import getNextVersion from '../../utils/getNextVersion.ts';
import requireFields from '../../utils/requireFields.ts';

export default async function saveTool(req: any, res: any) {
  try {
    const userId = req?.user?.id || 'Admin';
    const { tool, data, id } = req.body;

    if (!requireFields(['tool', 'data', 'id'], req.body, res)) return;

    const model = (prisma as any)[tool];
    if (!model) {
      return res.status(400).json({ message: 'Invalid tool type.' });
    }

    const latest = await model.findFirst({
      where: { id },
      orderBy: { updatedAt: 'desc' },
    });

    if (latest) {
      if (latest.status === 'PUBLISHED') {
        // Create a new draft version
        const version = await getNextVersion(model, id);
        await model.create({
          data: {
            ...data,
            version,
            status: 'DRAFT',
            createdBy: userId,
            contentType: 'OFFICIAL',
          },
        });
        return res.json({ message: 'New draft version created.' });
      } else {
        // Update the existing draft version
        await model.update({
          where: { refId: latest.refId },
          data: { ...data, updatedAt: new Date() },
        });
        return res.json({ message: 'Draft updated successfully.' });
      }
    } else {
      // Create brand new object
      await model.create({
        data: {
          id,
          ...data,
          version: 1,
          createdBy: userId,
          contentType: 'OFFICIAL',
        },
      });
      return res.json({ message: 'Content created successfully.' });
    }
  } catch (error) {
    console.error('Error saving content:', error);
    return res.status(500).json({ message: 'Error saving content.' });
  }
}
