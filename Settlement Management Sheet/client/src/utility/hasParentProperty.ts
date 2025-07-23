import { GlossaryEntryType, GlossaryNode } from 'types/index.js';

const propertyMap: Record<GlossaryEntryType, Array<string>> = {
  territory: [
    'climates',
    'terrain',
    'nations',
    'factions',
    'locations',
    'landmarks',
  ],
  province: ['nations', 'terrain', 'locations', 'landmarks'],
  location: ['locationType', 'regions'],
  person: ['occupations', 'titles', 'traits', 'factions', 'locations'],
  faction: ['leaders', 'homeBases', 'allies', 'enemies', 'activeKeys'],
  note: ['tags', 'sharedWith'],
  continent: [
    'nations',
    'regions',
    'locations',
    'resources',
    'landmarks',
    'climates',
    'terrain',
  ],
  domain: [
    'continents',
    'regions',
    'capitals',
    'languages',
    'persons',
    'flags',
    'locations',
    'landmarks',
  ],
  settlement: ['nations', 'regions', 'persons', 'locations'],
  event: ['locations', 'tags'],
  landmark: ['regions', 'terrain', 'type'],
};

function resolveInheritedPropertyOptions(
  property: string,
  node: GlossaryNode,
  mapLineage: string[] = [],
  originId: string
): {
  inTree: Array<{ id: string; entryType: GlossaryEntryType; property: string }>;
  inLineage: Array<{
    id: string;
    entryType: GlossaryEntryType;
    property: string;
  }>;
} {
  const inTree: Array<{
    id: string;
    entryType: GlossaryEntryType;
    property: string;
  }> = [];
  const inLineage: Array<{
    id: string;
    entryType: GlossaryEntryType;
    property: string;
  }> = [];
  const entryType: GlossaryEntryType = node.entryType;
  if (!propertyMap[entryType]) {
    console.warn(`No property map found for entry type: ${entryType}`);
    return { inTree: [], inLineage: [] };
  }
  if (propertyMap[entryType].includes(property)) {
    inTree.push({
      id: node.id,
      entryType: entryType,
      property,
    });
  }
  if (node.children) {
    for (const childNode of node.children) {
      if (childNode && childNode.id !== originId) {
        if (mapLineage.includes(childNode.id)) {
          inLineage.push({
            id: childNode.id,
            entryType: childNode.entryType,
            property,
          });
        }
        const { inTree: tree, inLineage: lineage } =
          resolveInheritedPropertyOptions(
            property,
            childNode,
            mapLineage,
            originId
          );
        inLineage.push(...lineage);
        inTree.push(...tree);
      } else {
        console.warn(
          `Child of node ${node.name} with id ${node.id} not found in state.`
        );
        continue;
      }
    }
  }
  return {
    inTree: inTree.flat(),
    inLineage: inLineage.flat(),
  };
}

export default resolveInheritedPropertyOptions;

type LineageNode = {
  id: string;
  entryType?: GlossaryEntryType;
  [key: string]: any;
};

export interface InheritanceMap {
  entryTypeMap: Partial<Record<GlossaryEntryType, string[]>>;
  relationships: Record<string, 'parent' | 'sibling' | 'extended'>;
}

const getOptionsContextMaps = ({
  node,
  nodeStructure,
}: {
  node: GlossaryNode;
  nodeStructure: Record<string, GlossaryNode>;
}): InheritanceMap => {
  const entryTypeMap: Partial<Record<GlossaryEntryType, string[]>> = {};
  const relationships: Record<string, 'parent' | 'sibling' | 'extended'> = {};
  let step = 0;

  // Bail if node has no parent or if parent isn't in structure
  const directParent = nodeStructure[node.parentId ?? ''];
  // Traverse up for parent lineage
  let currentNode: GlossaryNode | undefined = directParent;
  while (currentNode) {
    if (!entryTypeMap[currentNode.entryType]) {
      entryTypeMap[currentNode.entryType] = [];
    }
    entryTypeMap[currentNode.entryType]!.push(currentNode.id);
    relationships[currentNode.id] =
      step === 0 ? 'parent' : step === 1 ? 'sibling' : 'extended';
    step++;
    if (!currentNode.parentId) break;
    currentNode = nodeStructure[currentNode.parentId];
  }

  // Root-level node — find other root-level nodes as siblings
  if (!node.parentId) {
    for (const otherNode of Object.values(nodeStructure)) {
      if (!otherNode.parentId && otherNode.id !== node.id) {
        if (!entryTypeMap[otherNode.entryType]) {
          entryTypeMap[otherNode.entryType] = [];
        }
        entryTypeMap[otherNode.entryType]!.push(otherNode.id);
        relationships[otherNode.id] = 'sibling';
      }
    }
  }

  // Pull siblings from immediate parent only
  for (const child of directParent?.children ?? []) {
    if (child.id !== node.id) {
      if (!entryTypeMap[child.entryType]) {
        entryTypeMap[child.entryType] = [];
      }
      entryTypeMap[child.entryType]!.push(child.id);
      relationships[child.id] = 'sibling';
    }
  }

  // Add aunts/uncles
  const grandparent = nodeStructure[directParent?.parentId ?? ''];
  for (const uncle of grandparent?.children ?? []) {
    if (uncle.id !== directParent.id) {
      // Aunts/Uncles
      if (!entryTypeMap[uncle.entryType]) {
        entryTypeMap[uncle.entryType] = [];
      }
      entryTypeMap[uncle.entryType]!.push(uncle.id);
      relationships[uncle.id] = 'extended';

      // Cousins
      for (const cousin of uncle.children ?? []) {
        if (cousin.id !== node.id && cousin.id !== directParent.id) {
          if (!entryTypeMap[cousin.entryType]) {
            entryTypeMap[cousin.entryType] = [];
          }
          entryTypeMap[cousin.entryType]!.push(cousin.id);
        }
        relationships[cousin.id] = 'extended';
      }
    }
  }

  return { entryTypeMap, relationships };
};

export { getOptionsContextMaps };

export { resolveInheritedPropertyOptions };
