import prisma from '../db/db.ts';

const glossaryModelMap = {
  location: prisma.locationGlossary,
  lore: prisma.loreGlossary,
  person: prisma.personGlossary,
  event: prisma.eventGlossary,
};

export default glossaryModelMap;
