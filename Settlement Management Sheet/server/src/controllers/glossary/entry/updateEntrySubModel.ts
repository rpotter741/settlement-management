import prisma from '../../../db/db.ts';
import requireFields from '../../../utils/requireFields.ts';
import { subModelMap } from './subModelMap.ts';

export default async function getEntrySubModel(req: any, res: any) {
  const {
    id,
    subModel,
    updates,
  }: { id: string; subModel: keyof typeof subModelMap; updates: any } =
    req.body;
  if (!requireFields(['id', 'subModel', 'updates'], req.body, res)) return;

  try {
    if (!subModelMap[subModel]) {
      console.log(`Invalid sub-model:`, subModel);
      return res.status(400).json({ message: `Invalid sub-model.` });
    }

    await prisma.glossarySection.update({
      where: { id },
      data: {
        [subModel]: {
          upsert: {
            update: updates,
            create: {
              id,
              ...updates,
            },
          },
        },
      },
    });

    return res.json({ message: `${subModel} updated successfully.` });
  } catch (error) {
    console.error(`Error getting ${subModel}:`, error);
    return res
      .status(500)
      .json({ message: `Error updating ${subModel} for id ${id}.` });
  }
}
