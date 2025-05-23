import { GlossaryNode } from '../../../../../types';

/**
 * Rehydrates a flat array of glossary nodes into a nested 2-way tree.
 * Adds parent pointers and children arrays.
 * Returns the top-level root nodes (usually one root per glossary).
 */
export function rehydrateGlossaryTree(flatNodes: GlossaryNode[]): {
  roots: GlossaryNode[];
  nodeMap: Record<string, GlossaryNode>;
} {
  const nodeMap: Record<string, GlossaryNode> = {};
  const roots: GlossaryNode[] = [];

  // First pass: clone and index by id
  flatNodes.forEach((node) => {
    nodeMap[node.id] = { ...node, children: [] };
  });

  // Second pass: assign children and parent references
  Object.values(nodeMap).forEach((node) => {
    if (node.parentId) {
      const parent = nodeMap[node.parentId];
      if (parent) {
        parent.children!.push(node);
        node.parent = parent;
      } else {
        console.warn(
          `Parent ID ${node.parentId} not found for node ${node.id}`
        );
        node.parent = null;
        roots.push(node); // fail gracefully
      }
    } else {
      node.parent = null;
      roots.push(node);
    }
  });

  return { roots, nodeMap };
}
