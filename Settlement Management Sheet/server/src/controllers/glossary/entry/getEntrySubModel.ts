import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import isDetailFileType from '../../../utils/isDetailFileType.ts';
import requireFields from '../../../utils/requireFields.ts';
import { subModelMap, getModelEntry } from './subModelMap.ts';

export default async function getEntrySubModel(req: any, res: any) {
  const {
    id,
    entryType,
    subModel,
  }: { id: string; entryType: string; subModel: keyof typeof subModelMap } =
    req.query;
  if (!requireFields(['id', 'entryType', 'subModel'], req.query, res)) return;

  try {
    const entryModel = isDetailFileType(entryType)
      ? glossaryModelMap[entryType]
      : prisma.glossarySection;
    if (!entryModel) {
      console.log(`Invalid entry type:`, entryType);
      return res.status(400).json({ message: `Invalid entry type.` });
    }

    const parentExists = await getModelEntry({
      model: entryModel,
      where: { id },
      res,
      select: {
        id: true,
      },
    });

    if (!parentExists) {
      console.log(`Parent entry not found for ID:`, id);
      return res.status(404).json({ message: `Parent entry not found.` });
    }

    if (!subModelMap[subModel]) {
      console.log(`Invalid sub-model:`, subModel);
      return res.status(400).json({ message: `Invalid sub-model.` });
    }

    const subModelEntry = await getModelEntry({
      model: subModelMap[subModel],
      where: { id },
      res,
    });

    return res.json({ data: subModelEntry });
    // returning null is okay if the sub-model entry does not exist. Front end knows to create ephemeral entry.
  } catch (error) {
    console.error(`Error getting ${subModel}:`, error);
    return res.status(500).json({ message: `Error getting ${subModel}.` });
  }
}
