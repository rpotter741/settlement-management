import prisma from '../db/db.ts';

const glossaryModelMap = {
  location: prisma.locationGlossary,
  note: prisma.noteGlossary,
  person: prisma.personGlossary,
  event: prisma.eventGlossary,
};

export default glossaryModelMap;
