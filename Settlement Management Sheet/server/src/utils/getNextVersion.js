import prisma from '../db/db.js';

const getNextVersion = async (refId, tool) => {
  const model = prisma[tool];
  const latest = await model.findFirst({
    where: { refId },
    orderBy: { version: 'desc' },
  });
  return latest ? latest.version + 1 : 1;
};

export default getNextVersion;
