import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';
import { ensure } from '../../../../../shared/utils/ensure.ts';

type VisibilityMap = Record<string, string>;
type UpdateTypeMap = Record<string, string | VisibilityMap>;
type TermsMap = Record<string, UpdateTypeMap>;
type IntegrationState = Record<string, TermsMap>;

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
    // Explicitly type currentTerms as a Record<string, any>
    const currentTerms: any = glossary?.integrationState || {};

    for (const u of updates) {
      const { subModel, termKey, updateType, visibilityKey, value } = u;

      // deletion path: remove the whole term if value is null
      if (value == null) {
        if (currentTerms[subModel]) {
          delete currentTerms[subModel][termKey];
          if (Object.keys(currentTerms[subModel]).length === 0) {
            delete currentTerms[subModel];
          }
        }
        continue;
      }

      // insertion/update path
      const sub = ensure(currentTerms, subModel); // TermsMap
      const term = ensure(sub, termKey); // UpdateTypeMap

      if (visibilityKey) {
        // ensure updateType is a nested map
        let slot = term[updateType];
        if (!slot || typeof slot !== 'object' || Array.isArray(slot)) {
          slot = term[updateType] = {};
        }
        (slot as VisibilityMap)[visibilityKey] = value;
      } else {
        term[updateType] = value; // simple scalar
      }
    }

    const updatedIntegrationState: IntegrationState = { ...currentTerms };

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
