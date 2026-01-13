const getValidDependencies = (items, targetId) => {
  const graph = new Map();
  for (const item of items) {
    graph.set(
      item.refId,
      Array.isArray(item.dependencies?.refIds) ? item.dependencies.refIds : []
    );
  }

  // Recursive DFS to detect cycles
  const hasCycle = (nodeId, visited, inStack, targetId) => {
    if (nodeId === targetId) return true; // direct or indirect path to target
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    inStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor, visited, inStack, targetId)) return true;
    }

    inStack.delete(nodeId);
    return false;
  };

  // Filter out any item that would cause a cycle if added
  return items.filter((candidate) => {
    if (candidate.refId === targetId) return false;

    const simulatedGraph = new Map(graph);
    const currentDeps = [...(simulatedGraph.get(targetId) || [])];

    simulatedGraph.set(targetId, [...currentDeps, candidate.refId]);

    return !hasCycle(candidate.refId, new Set(), new Set(), targetId);
  });
};

export default getValidDependencies;
