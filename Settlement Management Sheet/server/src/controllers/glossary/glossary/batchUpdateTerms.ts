import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';

export default async function batchUpdateTerms(req: any, res: any) {
  try {
    const { id, updates } = req.body;
    if (!requireFields(['id', 'updates'], req.body, res)) return;
    const glossary = await prisma.glossary.findUnique({
      where: { id },
    });
    if (!glossary) {
      return res.status(404).json({ message: 'Glossary not found.' });
    }
    //@ts-ignore
    const currentTerms = glossary?.integrationState?.terms || {};
    updates.forEach((update: { key: string; value: string }) => {
      if (update.value) {
        currentTerms[update.key] = update.value;
      } else {
        delete currentTerms[update.key];
      }
    });

    const updatedIntegrationState = {
      //@ts-ignore
      ...glossary.integrationState,
      terms: currentTerms,
    };

    console.log(`Updating glossary ${id} with terms:`, updatedIntegrationState);

    const updatedGlossary = await prisma.glossary.update({
      where: { id },
      data: { integrationState: updatedIntegrationState },
    });
    console.log(`Updated glossary:`, updatedGlossary);
    return res.json({ glossary: updatedGlossary });
  } catch (error) {
    console.error(`Error updating glossary:`, error);
    return res.status(500).json({ message: `Error updating glossary.` });
  }
}
