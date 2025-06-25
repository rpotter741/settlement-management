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

function hasParentProperty(
  property: string,
  node: GlossaryNode
): Array<{ id: string; entryType: GlossaryEntryType; property: string }> {
  const hasPropertyList: Array<{
    id: string;
    entryType: GlossaryEntryType;
    property: string;
  }> = [];
  const entryType: GlossaryEntryType = node.entryType;
  if (!propertyMap[entryType]) {
    console.warn(`No property map found for entry type: ${entryType}`);
    return [];
  }
  if (propertyMap[entryType].includes(property)) {
    hasPropertyList.push({
      id: node.id,
      entryType: entryType,
      property,
    });
  }
  if (node.children) {
    for (const childNode of node.children) {
      if (childNode) {
        hasPropertyList.push(...hasParentProperty(property, childNode));
      } else {
        console.warn(
          `Child of node ${node.name} with id ${node.id} not found in state.`
        );
      }
    }
  }
  return hasPropertyList;
}

export default hasParentProperty;
