import {
  SubTypeCompoundProperty,
  SubTypeDropdownProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import {
  GlossaryEntryType,
  GlossaryNode,
  TYPE_BITMASKS,
} from '../../../../shared/types/index.js';
import { SmartSyncRule } from '../Glossary/Modals/EditSmartSyncRule.js';
import { Backlink } from './SyncWorkspace.js';

export class WorldCrawler {
  protected nodes: Map<string, GlossaryNode>;
  protected reverseIndex: Map<string, Map<string, any>>;
  protected bitmasks: Map<string, number>;
  protected rootSiblings: Set<string> = new Set();

  constructor(nodes: GlossaryNode[], backlinksTo: Backlink[]) {
    this.nodes = new Map();
    this.reverseIndex = new Map();
    this.bitmasks = new Map();
    this.hydrate(nodes, backlinksTo);
  }

  // build the view for traversal
  private hydrate(nodes: GlossaryNode[], backlinksTo: Backlink[]) {
    // initialize bit shifter
    for (const node of nodes) {
      this.bitmasks.set(node.id, TYPE_BITMASKS[node.entryType]);
      this.nodes.set(node.id, node);
      if (!node.parentId) {
        this.rootSiblings.add(node.id);
      }
    }

    for (const link of backlinksTo) {
      if (!this.reverseIndex.has(link.sourceId)) {
        this.reverseIndex.set(link.sourceId, new Map());
      }
      this.reverseIndex
        .get(link.sourceId)!
        .set(link.propertyId, link.propertyValue);
    }
  }

  private _getNeighbors(
    nodeId: string,
    target: 'Child' | 'Sibling' | 'Parent' | 'Backlink' | 'Entry Type'
  ): GlossaryNode[] {
    const node = this.nodes.get(nodeId);
    if (!node) return [];

    switch (target) {
      case 'Parent':
        return node.parentId
          ? [this.nodes.get(node.parentId)!].filter(Boolean)
          : [];
      case 'Sibling':
        if (!node.parentId) {
          // virtual root siblings
          return Array.from(this.rootSiblings).map((id) => this.nodes.get(id)!);
        } else {
          const parent = this.nodes.get(node.parentId);
          return parent?.children?.filter((child) => child.id !== nodeId) || [];
        }
      case 'Child':
        return node.children || [];
      case 'Backlink':
      case 'Entry Type':
        const neighbors: GlossaryNode[] = [];
        // parent
        if (node.parentId) {
          const parentNode = this.nodes.get(node.parentId);
          if (parentNode) neighbors.push(parentNode);
        } else {
          // virtual root siblings
          neighbors.push(
            ...Array.from(this.rootSiblings)
              .map((id) => this.nodes.get(id)!)
              .filter((n) => n.id !== nodeId)
          );
        }
        // siblings
        if (node.parentId) {
          const parent = this.nodes.get(node.parentId);
          if (parent && parent.children) {
            neighbors.push(
              ...parent.children.filter((child) => child.id !== nodeId)
            );
          }
        }
        // children
        if (node.children) {
          neighbors.push(...node.children);
        }
        return neighbors.filter(Boolean);
    }
  }

  //core recursive traversal engine --> note the use of generic T to allow for different result shapes
  protected traverse<T>(
    currentId: string,
    depth: number,
    config: {
      maxDepth: number;
      targetMask: number;
      relationship: Array<
        'Child' | 'Sibling' | 'Parent' | 'Backlink' | 'Entry Type'
      >;
      smartLinkRule?: SmartSyncRule;
    },
    onMatch: (node: GlossaryNode) => T | null,
    visited: Set<string> = new Set()
  ): T[] {
    const results: T[] = [];
    const node = this.nodes.get(currentId);

    if (!node || visited.has(currentId) || depth > config.maxDepth) {
      return results;
    }

    visited.add(currentId);

    // context match
    const match = onMatch(node);
    if (match) results.push(match);

    //structural pruning based on types
    for (const relationship of config.relationship) {
      const neighbors = this._getNeighbors(currentId, relationship);
      for (const neighbor of neighbors) {
        //eventually add in the ability to early check by bitmask accept maps. Only possible if I only also bitmask the type of relationship to the neighbor, eg, if it's a child and i'm looking for something the child isn't and can't hold, prune. Otherwise... I think that's really about the only way to do it.
        // if ((this.bitmasks.get(neighbor.id)! & config.targetMask) === 0) {
        //   console.log("can't do it hoe");
        //   continue;
        // }
        this.traverse(neighbor.id, depth + 1, config, onMatch, visited).forEach(
          (result) => results.push(result)
        );
      }
    }

    return results;
  }

  public getSearchMasks(types: GlossaryEntryType[]): number {
    return types.reduce((mask, type) => {
      return mask | (TYPE_BITMASKS[type] || 0);
    }, 0);
  }

  //last closing brace because i get lost all the time
}

export type SmartLinkEvaluationResult = {
  nodeId: string;
  matchedBy: 'type' | 'property';
  value?: any;
  isReciprocal?: boolean;
  name?: string;
};

export class SmartLinkCrawler extends WorldCrawler {
  public getSuggestions(
    originId: string,
    properties: (SubTypeDropdownProperty | SubTypeCompoundProperty)[]
  ) {
    const originNode = this.nodes.get(originId);
    if (!originNode) return [];

    const results: Record<string, SmartLinkEvaluationResult[]> = {};

    for (const prop of properties) {
      const { smartSync } = prop;
      console.log(Boolean(smartSync), prop.name);
      if (!smartSync) continue;
      const targetMask = this.getSearchMasks(smartSync.parameters.types || []);
      const suggestions = this.traverse<SmartLinkEvaluationResult>(
        originId,
        0,
        {
          maxDepth: smartSync.depth,
          targetMask,
          relationship: [smartSync.target || 'Child'],
          smartLinkRule: smartSync,
        },
        (node) =>
          this.evaluateNode(node, originId, prop.id, targetMask, smartSync),
        new Set()
      );
      results[prop.id] = Array.from(new Set(suggestions)).filter(Boolean);
    }

    return results;
  }

  private evaluateNode(
    node: GlossaryNode,
    originId: string,
    propId: string,
    targetMask: number,
    rule: SmartSyncRule
  ): SmartLinkEvaluationResult | null {
    if (node.id === originId) return null; // skip self

    if (TYPE_BITMASKS[node.entryType] & targetMask) {
      if (rule.parameters.propertyMatch) {
        const propValue = this.reverseIndex.get(node.id)?.get(propId);
        if (propValue) {
          return {
            nodeId: node.id,
            matchedBy: 'property',
            isReciprocal: true,
            value: propValue,
            name: node.name,
          };
        }
      }
      return {
        nodeId: node.id,
        matchedBy: 'type',
        name: node.name,
      };
    }
    return null;
  }

  // last closing brace for smart link crawler
}
