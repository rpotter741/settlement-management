import { GlossaryNode } from 'types/index.js';

export default function sortGlossaryNodes(
  nodes: GlossaryNode[]
): GlossaryNode[] {
  //@ts-ignore
  return nodes.sort(smartSort);
}

function smartSort<
  T extends { name: string; flatIndex?: number; fileType: 'file' | 'folder' },
>(a: T, b: T): number {
  const aPriority = a.flatIndex ?? 0;
  const bPriority = b.flatIndex ?? 0;

  const aHasCustom = aPriority > 0;
  const bHasCustom = bPriority > 0;

  if (aHasCustom && bHasCustom) {
    return aPriority - bPriority;
  } else if (aHasCustom) {
    return -1;
  } else if (bHasCustom) {
    return 1;
  } else if (a.fileType === 'folder' && b.fileType === 'file') {
    return -1; // Folders come before files
  } else if (a.fileType === 'file' && b.fileType === 'folder') {
    return 1; // Files come after folders
  } else {
    return a.name.localeCompare(b.name);
  }
}
