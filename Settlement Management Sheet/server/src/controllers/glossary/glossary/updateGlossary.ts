import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateGlossary(req, res) {
  try {
    const { id, updates } = req.body;
    if (!requireFields(['id', 'updates'], req.body, res)) return;
    const updatedGlossary = await prisma.glossary.update({
      where: { id },
      data: { ...updates },
    });
    return res.json({ glossary: updatedGlossary });
  } catch (error) {
    console.error(`Error updating glossary:`, error);
    return res.status(500).json({ message: `Error updating glossary.` });
  }
}
