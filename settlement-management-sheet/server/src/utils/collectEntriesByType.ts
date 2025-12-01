function collectEntriesByTypeFromFlat(
  rootId: string,
  flatNodes: GlossaryNode[]
): Record<string, string[]> {
  const nodeMap: Record<string, GlossaryNode> = {};
  const childrenMap: Record<string, GlossaryNode[]> = {};

  // Build lookup maps
  flatNodes.forEach((node) => {
    nodeMap[node.id] = node;
    if (node.parentId) {
      if (!childrenMap[node.parentId]) childrenMap[node.parentId] = [];
      childrenMap[node.parentId].push(node);
    }
  });

  const result: Record<string, string[]> = {};

  function recurse(currentId: string) {
    const current = nodeMap[currentId];
    if (!current) return;

    if (current.entryType) {
      if (!result[current.entryType]) result[current.entryType] = [];
      result[current.entryType].push(current.id);
    }

    const children = childrenMap[currentId] || [];
    children.forEach((child) => recurse(child.id));
  }

  recurse(rootId);
  return result;
}

export default collectEntriesByTypeFromFlat;
