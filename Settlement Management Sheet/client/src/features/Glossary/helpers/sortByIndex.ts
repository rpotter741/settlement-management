import { GlossaryNode } from '../../../../../types';

export default function sortGlossaryNodes(
  nodes: GlossaryNode[]
): GlossaryNode[] {
  return nodes.sort(smartSort);
}

function smartSort<T extends { name: string; sortIndex?: number }>(
  a: T,
  b: T
): number {
  const aPriority = a.sortIndex ?? 0;
  const bPriority = b.sortIndex ?? 0;

  const aHasCustom = aPriority > 0;
  const bHasCustom = bPriority > 0;

  if (aHasCustom && bHasCustom) {
    return aPriority - bPriority;
  } else if (aHasCustom) {
    return -1;
  } else if (bHasCustom) {
    return 1;
  } else {
    return a.name.localeCompare(b.name);
  }
}
