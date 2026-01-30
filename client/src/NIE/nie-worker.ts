/// <reference lib="webworker" />

export interface GlossaryNode {
  id: string;
  name: string;
  fileType: 'section' | 'detail';
  entryType: string;
  parentId: string | null;
  children?: GlossaryNode[];
  parent?: GlossaryNode | null;
  glossaryId: string;
  subTypeId: string;
  icon?: {
    name: string;
    color: string;
    backgroundColor: string;
    viewBox: string;
    path: string;
    size: number;
  };
  sortIndex?: number;
  flatIndex?: number;
}

// example weights for different relationship types
const PARENT_CHILD_WEIGHT = 0.5;
const DIRECT_WEIGHT = 1.0;
const INDIRECT_WEIGHT = 1.5;

self.onmessage = (event) => {
  // Does this log?
};

self.addEventListener('error', (event) => {
  console.error('Worker error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

self.onmessage = (event) => {
  try {
    const { action, nodes, entries, backlinks } = event.data;

    const ids: string[] = [];
    const entryMap: Record<string, any> = {};

    entries.forEach((e: any) => {
      ids.push(e.id);
      entryMap[e.id] = e;
    });

    if (action === 'buildGraph') {
      const total = nodes.length;

      const graph: NIEGraph = nodes.reduce(
        (acc: NIEGraph, node: GlossaryNode, index: number) => {
          // filter relevant data from the event
          const entry = entryMap[node.id];
          const entryBacklinks = backlinks.filter(
            (b: any) => b.sourceId === node.id || b.targetId === node.id
          );
          // Build node entry
          acc = buildGraphNode({
            acc,
            node,
            entry,
            backlinks: entryBacklinks,
            ids,
          });

          if (index % 10 === 0) {
            self.postMessage({
              action: 'progress',
              current: index + 1,
              total,
              percent: Math.round(((index + 1) / total) * 100),
            });
          }

          return acc;
        },
        {}
      );

      const anchorMap: AnchorMap = Object.values(graph).reduce(
        (acc: AnchorMap, node: GraphNode, index: number) => {
          acc = mapGraphNodeAnchors({ acc, node });

          if (index % 10 === 0) {
            self.postMessage({
              action: 'anchorProgress',
              current: index + 1,
              total: Object.values(graph).length,
              percent: Math.round(
                ((index + 1) / Object.values(graph).length) * 100
              ),
            });
          }

          return acc;
        },
        {} as AnchorMap
      );

      self.postMessage({
        action: 'complete',
        graph,
        anchorMap,
      });
    }
    // your existing code...
  } catch (error: any) {
    console.error('Worker message handler error:', error);
    self.postMessage({
      action: 'error',
      error: error.message,
      stack: error.stack,
    });
  }
};

type AnchorMap = Record<string, Record<string, string[]>>;

function mapGraphNodeAnchors({
  acc,
  node,
}: {
  acc: AnchorMap;
  node: GraphNode;
}) {
  const primaryId = node.primaryId;
  const primaryAnchor = node.primaryValue;
  const secondaryId = node.secondaryId;
  const secondaryAnchor = node.secondaryValue;

  if (!acc[primaryId]) {
    acc[primaryId] = { [primaryAnchor]: [] };
  }
  acc[primaryId]![primaryAnchor].push(node.id);

  if (!acc[secondaryId]) {
    acc[secondaryId] = { [secondaryAnchor]: [] };
  }
  acc[secondaryId]![secondaryAnchor].push(node.id);

  return acc;
}

interface NIEGraph {
  [key: string]: GraphNode;
}

interface GraphNode {
  id: string;
  name: string;
  type: string;
  primaryValue: string;
  primaryId: string;
  primaryName: string;
  secondaryValue: string;
  secondaryId: string;
  secondaryName: string;
  subTypeId: string;
  parentId?: string | null;
  relationships: Record<string, { distance: number; type: string }>;
}

function buildGraphNode({
  acc,
  node,
  entry,
  backlinks,
  ids,
}: {
  acc: Record<string, GraphNode>;
  node: any;
  entry: any;
  backlinks: any[];
  ids: string[];
}) {
  const graphNode: GraphNode = {
    id: node.id,
    name: node.name,
    type: entry.entryType,
    primaryValue: entry.primaryAnchorValue,
    primaryId: entry.primaryAnchorId,
    primaryName: '',
    secondaryValue: entry.secondaryAnchorValue,
    secondaryId: entry.secondaryAnchorId,
    secondaryName: '',
    subTypeId: entry.subTypeId,
    parentId: node.parentId,
    relationships: {},
  };

  if (node.parentId) {
    graphNode.relationships[node.parentId] = {
      distance: PARENT_CHILD_WEIGHT,
      type: 'parent',
    };
  }

  if (node.children) {
    node.children.forEach((child: GlossaryNode) => {
      graphNode.relationships[child.id] = {
        distance: PARENT_CHILD_WEIGHT,
        type: 'child',
      };
    });
  }

  backlinks.forEach(
    (link: { sourceId: string; targetId: string; type: string }) => {
      const targetId =
        link.sourceId === node.id ? link.targetId : link.sourceId;
      const weight = link.type === 'dropdown' ? DIRECT_WEIGHT : INDIRECT_WEIGHT;
      graphNode.relationships[targetId] = { distance: weight, type: link.type };
    }
  );

  acc[node.id] = graphNode;
  return acc;
}

function findShortestPath(
  graph: Record<string, GraphNode>,
  startId: string,
  endId: string,
  maxDepth: number = Infinity
): number | null {
  if (startId === endId) return 0;

  const visited = new Set<string>([startId]);
  const queue: Array<{ id: string; distance: number }> = [
    { id: startId, distance: 0 },
  ];

  while (queue.length > 0) {
    const { id, distance } = queue.shift()!;
    if (distance >= maxDepth) continue;

    const node = graph[id];
    if (!node) continue;

    // collect all directly connected neighbors
    const neighbors = [...Object.keys(node.relationships || {})];

    for (const neighborId of neighbors) {
      if (visited.has(neighborId)) continue;

      const weight =
        node.relationships?.[neighborId]?.distance ??
        (neighborId === node.parentId ? 1.0 : 1.0); // default weight

      const totalDistance = distance + weight;
      if (neighborId === endId) return totalDistance;

      visited.add(neighborId);
      queue.push({ id: neighborId, distance: totalDistance });
    }
  }

  return null; // no path found
}
