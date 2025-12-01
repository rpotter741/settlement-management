const getBreadcrumbTrail = (roots, target) => {
  const path = [];

  const traverse = (node) => {
    if (!node) return false;
    path.push(node.title || 'Untitled');

    // Use id or title — id is safer if you add them
    if (node.title === target) return true;

    if (node.children) {
      for (const child of node.children) {
        if (traverse(child)) return true;
      }
    }

    path.pop(); // backtrack
    return false;
  };

  for (const root of roots) {
    if (traverse(root)) break;
  }

  return path;
};

export default getBreadcrumbTrail;
