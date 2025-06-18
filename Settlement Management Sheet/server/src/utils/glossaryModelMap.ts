import prisma from '../db/db.ts';

const glossaryModelMap = {
  continent: prisma.continentGlossary,
  faction: prisma.factionGlossary,
  location: prisma.locationGlossary,
  note: prisma.noteGlossary,
  person: prisma.personGlossary,
  territory: prisma.territoryGlossary,
  domain: prisma.domainGlossary,
  settlement: prisma.settlementGlossary,
  event: prisma.eventGlossary,
  landmark: prisma.landmarkGlossary,
  province: prisma.provinceGlossary,
};

export default glossaryModelMap;
