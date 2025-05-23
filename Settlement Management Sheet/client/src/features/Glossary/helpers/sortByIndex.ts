import { GlossaryNode } from '../../../../../types';

function sortByIndex<T extends { sortIndex: number }>(a: T, b: T): number {
  return a.sortIndex - b.sortIndex;
}

export default function sortGlossaryNodes(
  nodes: Record<string, GlossaryNode>
): GlossaryNode[] {
  return Object.values(nodes).sort(sortByIndex);
}
