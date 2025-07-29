// import { GlossaryNode } from '../../../../../types';

// /**
//  * Rehydrates a flat array of glossary nodes into a nested 2-way tree.
//  * Adds parent pointers and children arrays.
//  * Returns the top-level root nodes (usually one root per glossary).
//  */
// export function rehydrateGlossaryTree(flatNodes: GlossaryNode[]): {
//   roots: GlossaryNode[];
//   nodeMap: Record<string, GlossaryNode>;
// } {
//   const nodeMap: Record<string, GlossaryNode> = {};
//   const roots: GlossaryNode[] = [];

//   // First pass: clone and index by id
//   flatNodes.forEach((node) => {
//     nodeMap[node.id] = { ...node, children: [] };
//   });

//   // Second pass: assign children and parent references
//   Object.values(nodeMap).forEach((node) => {
//     if (node.parentId) {
//       const parent = nodeMap[node.parentId];
//       if (parent) {
//         parent.children!.push(node);
//         node.parent = parent;
//       } else {
//         console.warn(
//           `Parent ID ${node.parentId} not found for node ${node.id}`
//         );
//         node.parent = null;
//         roots.push(node); // fail gracefully
//       }
//     } else {
//       node.parent = null;
//       roots.push(node);
//     }
//   });

//   return { roots, nodeMap };
// }

import { GlossaryNode } from '../../../../../types/index.js';

/**
 * Rehydrates a flat array of glossary nodes into a tree of root nodes,
 * but keeps the returned nodeMap flat and serializable.
 * Each node in the map has a `flatIndex` (its order in the original array).
 */
export function rehydrateGlossaryTree(
  flatNodes: GlossaryNode[],
  existingState: Record<string, { expanded: boolean; rename: boolean }> = {}
): {
  roots: GlossaryNode[];
  nodeMap: Record<string, GlossaryNode & { flatIndex: number }>;
  renderState: Record<string, { expanded: boolean; rename: boolean }>;
} {
  const nodeMap: Record<string, GlossaryNode & { flatIndex: number }> = {};
  const roots: GlossaryNode[] = [];
  const renderState: Record<string, { expanded: boolean; rename: boolean }> =
    {};

  // First pass: clone nodes, add flatIndex, and initialize children
  flatNodes.forEach((node, index) => {
    nodeMap[node.id] = { ...node, children: [], flatIndex: index };
  });

  // Second pass: assign children based on parentId
  Object.values(nodeMap).forEach((node) => {
    if (node.parentId) {
      const parent = nodeMap[node.parentId];
      if (parent) {
        parent.children!.push(node);
      } else {
        console.warn(
          `Parent ID ${node.parentId} not found for node ${node.id}`
        );
        roots.push(node); // fallback
      }
    } else {
      roots.push(node);
    }
    if (existingState[node.id]) {
      console.log(node.name, 'mx state');

      renderState[node.id] = existingState[node.id];
    } else {
      // console.log(node.name, 'going false');
      renderState[node.id] = {
        expanded: false,
        rename: false,
      };
    }
  });

  return { roots, nodeMap, renderState };
}
