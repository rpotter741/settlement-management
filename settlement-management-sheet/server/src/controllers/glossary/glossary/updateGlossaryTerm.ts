import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function updateGlossaryTerm(req: any, res: any) {
  try {
    const { id, key, value } = req.body;
    if (!requireFields(['id', 'key', 'value'], req.body, res)) return;
    const glossary = await prisma.glossary.findUnique({
      where: { id },
    });
    if (!glossary) {
      return res.status(404).json({ message: 'Glossary not found.' });
    }
    //@ts-ignore
    const currentTerms = glossary?.integrationState?.terms || {};
    const updateTerms = {
      ...currentTerms,
      [key]: value,
    };

    Object.keys(updateTerms).forEach((key) => {
      if (updateTerms[key] === undefined || updateTerms[key] === null) {
        delete updateTerms[key];
      }
    });

    const updatedIntegrationState = {
      //@ts-ignore
      ...glossary.integrationState,
      terms: updateTerms,
    };

    const updatedGlossary = await prisma.glossary.update({
      where: { id },
      data: { integrationState: updatedIntegrationState },
    });

    return res.json({ glossary: updatedGlossary });
  } catch (error) {
    console.error(`Error updating glossary:`, error);
    return res.status(500).json({ message: `Error updating glossary.` });
  }
}
