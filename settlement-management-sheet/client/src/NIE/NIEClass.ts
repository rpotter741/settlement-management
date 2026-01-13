import {
  GlossaryEntryType,
  GlossaryNode,
} from '../../../shared/types/index.js';

// types.ts
export type NIEGraphNode = {
  id: string;
  type: GlossaryEntryType; // "event", "entity", "location", etc.
  primaryAnchor: string;
  secondaryAnchor: string;
  attributes?: Record<string, any>;
  links: { target: string; weight: number; type?: string }[];
};

export type NIEGraph = Map<string, NIEGraphNode>;

export type NIEContext = {
  localizedData: Record<string, any>;
  anchors: string[];
  events?: string[];
};

// NarrativeInferenceEngine.ts
export class NarrativeInferenceEngine {
  private graph: NIEGraph = new Map();
  private anchorMap: Map<string, string[]> = new Map(); // e.g. category -> nodeIds
  private weights: Map<string, number> = new Map(); // precomputed weights cache

  constructor(worldData: any) {
    this.buildGraph(worldData);
  }

  /** ------------------------------
   *  GRAPH INITIALIZATION
   *  ------------------------------ */
  private buildGraph(worldData: GlossaryNode[]) {
    // Convert world data into graph nodes
    worldData.forEach((entry: any) => {
      this.graph.set(entry.id, {
        id: entry.id,
        type: entry.type,
        primaryAnchor: entry.primaryAnchor,
        secondaryAnchor: entry.secondaryAnchor,
        attributes: entry.attributes ?? {},
        links: this.extractLinks(entry),
      });
    });
    this.buildAnchors();
  }

  private extractLinks(entry: any): NIEGraphNode['links'] {
    // Basic relationship extraction, can evolve later
    const links: NIEGraphNode['links'] = [];
    if (entry.relationships) {
      for (const rel of entry.relationships) {
        links.push({
          target: rel.targetId,
          weight: rel.weight ?? 1,
          type: rel.type,
        });
      }
    }
    return links;
  }

  private buildAnchors() {
    // Organize nodes by category or tag for fast lookup
    for (const node of this.graph.values()) {
      const primary = node.primaryAnchor;
      const secondary = node.secondaryAnchor;

      if (!this.anchorMap.has(primary)) {
      }
    }
  }

  /** ------------------------------
   *  CORE INFERENCE LOGIC
   *  ------------------------------ */

  public inferContext(eventId: string, depth = 2): NIEContext {
    const visited = new Set<string>();
    const context: NIEContext = { localizedData: {}, anchors: [] };

    const traverse = (id: string, level: number) => {
      if (level > depth || visited.has(id)) return;
      visited.add(id);
      const node = this.graph.get(id);
      if (!node) return;

      // Record localized data
      context.localizedData[id] = node.attributes;

      // Traverse connections
      node.links.forEach((link) => traverse(link.target, level + 1));
    };

    traverse(eventId, 0);
    return context;
  }

  /** ------------------------------
   *  SCORING & RELATIONSHIP QUERIES
   *  ------------------------------ */

  public scoreConnection(aId: string, bId: string): number {
    const a = this.graph.get(aId);
    const b = this.graph.get(bId);
    if (!a || !b) return 0;

    // Simple overlap score; can evolve into semantic similarity
    const directLink = a.links.find((l) => l.target === bId);
    const score = directLink ? directLink.weight : 0;
    return score;
  }

  public findNearestAnchors(anchorTag: string, limit = 5): NIEGraphNode[] {
    const anchorIds = this.anchorMap.get(anchorTag) ?? [];
    return anchorIds
      .map((id) => this.graph.get(id)!)
      .filter(Boolean)
      .slice(0, limit);
  }

  /** ------------------------------
   *  STATIC UTILITIES
   *  ------------------------------ */

  static fromJSON(jsonData: any) {
    return new NarrativeInferenceEngine(jsonData);
  }
}
