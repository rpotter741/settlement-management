import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function getGlossaryById(req, res) {
  const { id } = req.params;

  try {
    requireFields(['id'], req.params, res);

    const glossary = await prisma.glossary.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        genre: true,
        subGenre: true,
      },
    });

    if (!glossary) {
      return res.status(404).json({ error: 'Glossary not found' });
    }

    return res.status(200).json(glossary);
  } catch (error) {
    console.error('Error fetching glossary by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
