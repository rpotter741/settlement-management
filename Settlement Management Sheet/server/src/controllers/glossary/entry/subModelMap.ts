import prisma from '../../../db/db.ts';

const subModelMap = {
  politics: prisma.glossaryPolitics,
  geography: prisma.glossaryGeography,
  history: prisma.glossaryHistory,
  relationships: prisma.glossaryRelationships,
  custom: prisma.glossaryCustom,
};

async function getModelEntry({
  model,
  where,
  res,
  select,
}: {
  model: any;
  where: any;
  res: any;
  select?: any;
}): Promise<any> {
  if (!model || !where)
    return res.status(400).json({ message: `Invalid request.` });
  return model.findUnique({
    where,
    select,
  });
}

function convertSubModelToModelName(subModel: string): string {
  return `glossary${subModel.charAt(0).toUpperCase() + subModel.slice(1)}`;
}

export { subModelMap, getModelEntry, convertSubModelToModelName };
