import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function createGlossary(req, res) {
  try {
    const {
      id,
      name,
      description,
      genre,
      subGenre,
      theme = 'default',
    } = req.body;
    if (
      !requireFields(
        ['id', 'name', 'description', 'genre', 'subGenre'],
        req.body,
        res
      )
    )
      return;
    const newGlossary = await prisma.glossary.create({
      data: {
        id,
        version: 1,
        name,
        description,
        genre,
        subGenre,
        createdBy: req?.user?.id || 'robbiepottsdm',
        contentType: 'CUSTOM',
        theme,
        integrationState: {},
      },
    });
    return res.json({ glossary: newGlossary });
  } catch (error) {
    console.error(`Error creating glossary:`, error);
    return res.status(500).json({ message: `Error creating glossary.` });
  }
}
