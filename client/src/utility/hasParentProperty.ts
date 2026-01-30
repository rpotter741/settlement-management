import { cloneDeep } from 'lodash';
import { GlossaryEntryType, GlossaryNode } from 'types/index.js';

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
  relationships: Record<
    string,
    'parent' | 'sibling' | 'extended' | 'child' | 'uncle' | 'grandparent'
  >;
}

const RELATIONSHIP_RANK: Record<string, number> = {
  parent: 1,
  sibling: 2,
  grandparent: 3,
  child: 4,
  uncle: 5,
  extended: 6,
  other: 7,
};

const getOptionsContextMaps = ({
  node,
  nodeStructure,
  includeNephews = false,
  entryTypes,
}: {
  node: GlossaryNode;
  nodeStructure: Record<string, GlossaryNode>;
  includeNephews?: boolean;
  entryTypes?: GlossaryEntryType[];
}): InheritanceMap => {
  const entryTypeMap: Partial<Record<GlossaryEntryType, string[]>> = {};
  const relationships: Record<
    string,
    'parent' | 'sibling' | 'extended' | 'uncle' | 'grandparent'
  > = {};
  let step = 0;

  const safeStructure: Record<string, GlossaryNode> = ensureVirtualRoot(
    cloneDeep(nodeStructure)
  );

  const safeNodeReference = safeStructure[node.id];

  // Bail if node has no parent or if parent isn't in structure
  const directParent = safeStructure[safeNodeReference.parentId ?? ''];
  // Traverse up for parent lineage
  let currentNode: GlossaryNode | undefined = directParent;
  while (currentNode && currentNode.entryType) {
    if (!entryTypeMap[currentNode.entryType]) {
      entryTypeMap[currentNode.entryType] = [];
    }
    entryTypeMap[currentNode.entryType]!.push(currentNode.id);
    relationships[currentNode.id] =
      step === 0 ? 'parent' : step === 1 ? 'grandparent' : 'extended';
    step++;
    if (!currentNode.parentId) break;
    currentNode = safeStructure[currentNode.parentId];
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
    if (includeNephews) {
      // Nephews
      for (const nephew of child.children ?? []) {
        if (nephew.id !== node.id && nephew.id !== directParent.id) {
          if (!entryTypeMap[nephew.entryType]) {
            entryTypeMap[nephew.entryType] = [];
          }
          entryTypeMap[nephew.entryType]!.push(nephew.id);
          relationships[nephew.id] = 'extended';
        }
      }
    }
  }

  // Add aunts/uncles
  const grandparent = safeStructure[directParent?.parentId ?? ''];
  for (const uncle of grandparent?.children ?? []) {
    if (uncle.id !== directParent.id) {
      // Aunts/Uncles
      if (!entryTypeMap[uncle.entryType]) {
        entryTypeMap[uncle.entryType] = [];
      }
      entryTypeMap[uncle.entryType]!.push(uncle.id);
      relationships[uncle.id] = 'uncle';

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

  if (entryTypes && entryTypes.length > 0) {
    Object.keys(entryTypeMap).forEach((key: string) => {
      if (!entryTypes.includes(key as GlossaryEntryType)) {
        delete entryTypeMap[key as GlossaryEntryType];
      }
    });
  }

  return { entryTypeMap, relationships };
};

export { getOptionsContextMaps, RELATIONSHIP_RANK };

export { resolveInheritedPropertyOptions };

export const ensureVirtualRoot = (
  nodeStructure: Record<string, GlossaryNode>
): Record<string, GlossaryNode> => {
  const rootNodes = Object.values(nodeStructure).filter((n) => !n.parentId);
  if (!rootNodes.length) return nodeStructure;

  const VIRTUAL_ROOT_ID = '__root__';
  const virtualRoot: GlossaryNode = {
    id: VIRTUAL_ROOT_ID,
    name: '__virtual_root__',
    glossaryId: rootNodes[0].glossaryId,
    children: rootNodes,
    //@ts-ignore
    isVirtualRoot: true,
  };

  for (const node of rootNodes) node.parentId = VIRTUAL_ROOT_ID;

  return {
    ...nodeStructure,
    [VIRTUAL_ROOT_ID]: virtualRoot,
  };
};
