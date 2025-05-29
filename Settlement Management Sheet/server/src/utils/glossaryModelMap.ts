import prisma from '../db/db.ts';

const glossaryModelMap = {
  continent: prisma.continentGlossary,
  faction: prisma.factionGlossary,
  location: prisma.locationGlossary,
  note: prisma.noteGlossary,
  person: prisma.personGlossary,
  poi: prisma.poiGlossary,
  region: prisma.regionGlossary,
  nation: prisma.nationGlossary,
  settlement: prisma.settlementGlossary,
  event: prisma.eventGlossary,
  geography: prisma.geographyGlossary,
};

export default glossaryModelMap;
