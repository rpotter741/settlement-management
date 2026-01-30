import { ulid as newId } from 'ulid';

interface SubType {
  id: string;
  name?: string;
  groupOrder: string[];
  groupData: Record<string, any>;
  anchors: {
    primary: string | null;
    secondary: string | null;
  };
}

/**
 * Deep clone a subtype object, regenerating IDs for groups and properties.
 * Returns a new subtype and a mapping of old→new IDs.
 */
export function cloneSubTypeWithNewIds(subType: SubType) {
  const newSubType: any = structuredClone(subType);
  const idMap = {
    subType: { [subType.id]: newId() },
    groups: {} as Record<string, string>,
    properties: {} as Record<string, string>,
    anchors: {} as Record<'primary' | 'secondary', string>,
  };

  // Give the subType itself a new id
  newSubType.id = idMap.subType[subType.id];

  // Remap group ids
  newSubType.groupOrder = subType.groupOrder.map((oldGroupId) => {
    const newGroupId = newId();
    idMap.groups[oldGroupId] = newGroupId;
    return newGroupId;
  });

  newSubType.groupData = {};
  for (const oldGroupId of subType.groupOrder) {
    const oldGroup = subType.groupData[oldGroupId];
    const newGroupId = idMap.groups[oldGroupId];
    const newGroup = structuredClone(oldGroup);

    newGroup.id = newGroupId;
    newGroup.propertyOrder = oldGroup.propertyOrder.map((oldPropId: string) => {
      const newPropId = newId();
      idMap.properties[oldPropId] = newPropId;
      if (subType.anchors.primary === oldPropId) {
        idMap.anchors.primary = newPropId;
        newSubType.anchors.primary = newPropId;
      }
      if (subType.anchors.secondary === oldPropId) {
        idMap.anchors.secondary = newPropId;
        newSubType.anchors.secondary = newPropId;
      }
      return newPropId;
    });

    newGroup.propertyData = {};
    for (const oldPropId of oldGroup.propertyOrder) {
      const newPropId = idMap.properties[oldPropId];
      const newProperty = structuredClone(oldGroup.propertyData[oldPropId]);
      newProperty.id = newPropId;
      newGroup.propertyData[newPropId] = newProperty;
    }

    newSubType.groupData[newGroupId] = newGroup;
  }

  return { newSubType, idMap };
}
