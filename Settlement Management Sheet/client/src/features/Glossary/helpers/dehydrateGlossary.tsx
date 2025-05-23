import { GlossaryNode } from '../../../../../types';

export function dehydrateGlossaryTree(tree: GlossaryNode[]): GlossaryNode[] {
  const flatList: GlossaryNode[] = [];

  const recurse = (node: GlossaryNode, parentId: string | null = null) => {
    const { children, parent, ...rest } = node;
    flatList.push({ ...rest, parentId });
    if (children) {
      for (const child of children) {
        recurse(child, node.id);
      }
    }
  };

  for (const root of tree) {
    recurse(root, null);
  }

  return flatList;
}
