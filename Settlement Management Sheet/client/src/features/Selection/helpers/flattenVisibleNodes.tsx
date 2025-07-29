import { SelectionObject } from '@/app/types/SelectionTypes.js';

interface DepthEntry {
  id: string;
  depth: number;
}

function flattenVisibleNodes({
  tree,
  renderState,
}: {
  tree: SelectionObject[];
  renderState: Record<string, { expanded: boolean }>;
}): DepthEntry[] {
  if (!tree.length || !renderState) return [];
  const visible: DepthEntry[] = [];
  const traverse = (node: SelectionObject, depth: number) => {
    visible.push({ id: node.id, depth });
    if (
      node.fileType === 'section' &&
      renderState[node.id]?.expanded &&
      node.children
    ) {
      node.children.forEach((childNode: SelectionObject) => {
        traverse(childNode, depth + 1);
      });
    }
  };
  tree.forEach((node: SelectionObject) => {
    traverse(node, 0);
  });
  return visible;
}

export default flattenVisibleNodes;
