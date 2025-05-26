import { GlossaryNode } from '../../../../../types';

function reorderGlossaryNodes(
  structure: GlossaryNode[],
  sourceId: string,
  targetId: string
): { updates: { nodeId: string; nodeData: Partial<GlossaryNode> }[] } {
  const current = [...structure];

  const fromIndex = current.findIndex((n) => n.id === sourceId);
  const toIndex = current.findIndex((n) => n.id === targetId);

  if (fromIndex === -1 || toIndex === -1) return { updates: [] };

  const [moved] = current.splice(fromIndex, 1);
  current.splice(toIndex, 0, moved);

  // Renumber
  const updates = current.map((node, index) => ({
    nodeId: node.id,
    nodeData: { sortIndex: index + 1 },
  }));

  return { updates };
}

export default reorderGlossaryNodes;
