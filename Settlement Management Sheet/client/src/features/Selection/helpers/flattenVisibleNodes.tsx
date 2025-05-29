import { SelectionObject } from '../state/types';

function flattenVisibleNodes({
  tree,
  renderState,
}: {
  tree: SelectionObject[];
  renderState: Record<string, { expanded: boolean }>;
}): string[] {
  if (!tree.length || !renderState) return [];
  const visible: string[] = [];
  const traverse = (node: SelectionObject) => {
    visible.push(node.id);
    if (
      node.type === 'folder' &&
      renderState[node.id]?.expanded &&
      node.children
    ) {
      node.children.forEach((childNode: SelectionObject) => {
        traverse(childNode);
      });
    }
  };
  tree.forEach((node: SelectionObject) => {
    traverse(node);
  });
  return visible;
}

export default flattenVisibleNodes;
