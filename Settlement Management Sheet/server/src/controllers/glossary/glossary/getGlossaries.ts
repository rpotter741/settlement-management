import prisma from '../../../db/db.ts';

export default async function getGlossaries(req, res) {
  try {
    const userId = req?.user?.id || 'robbiepottsdm';

    const glossaries = await prisma.glossary.findMany({
      where: { createdBy: userId },
      orderBy: [{ updatedAt: 'desc' }],
      select: {
        id: true,
        name: true,
        description: true,
        genre: true,
        subGenre: true,
      },
    });
    return res.json(glossaries);
  } catch (error) {
    console.error(`Error getting glossaries:`, error);
    return res.status(500).json({ message: `Error getting glossaries.` });
  }
}
