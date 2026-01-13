import prisma from '../db/db.ts';

const buildNIEGraphController = async (req: any, res: any) => {
  const { glossaryId } = req.params;
  // fetch all nodes, entries, and backlinks for the given glossaryID
  const nodes = await prisma.glossaryNode.findMany({
    where: { glossaryId },
  });

  const nodeIds = nodes.map((node) => node.id);

  const entries = await prisma.glossaryEntry.findMany({
    where: { id: { in: nodeIds } },
  });

  const [toBacklinks, fromBacklinks] = await prisma.$transaction(async (tx) => {
    const toB = await tx.backlinkIndex.findMany({
      where: { targetId: { in: nodeIds } },
    });
    const fromB = await tx.backlinkIndex.findMany({
      where: { sourceId: { in: nodeIds } },
    });
    return [toB, fromB];
  });

  // build graph nodes
  const graphNodes = nodeIds.map((id) => {
    const entry = entries.find((e) => e.id === id);
  });
};
