import { invoke } from '@tauri-apps/api/core';
import { GenericObject } from '../../../../shared/types/common.ts';
import { GlossaryEntryType } from '../../../../shared/types/index.ts';
import {
  AllShapes,
  SubType,
  SubTypeGroup,
  SubTypeGroupLink,
  SubTypeProperty,
  SubTypePropertyLink,
} from '../slice/subTypeSlice.ts';
import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.tsx';

export async function addGroupToSubType({
  id,
  groupId,
  subtypeId,
  order,
}: {
  id: string;
  groupId: string;
  subtypeId: string;
  order: number;
}) {
  try {
    const result: SubTypeGroupLink = await invoke('add_group_to_subtype', {
      input: {
        id,
        groupId,
        subtypeId,
        order,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createGroupProperty({
  id,
  groupId,
  propertyId,
  order,
}: {
  id: string;
  groupId: string;
  propertyId: string;
  order: number;
}) {
  try {
    const result: GenericObject = await invoke('create_group_property', {
      input: {
        id,
        groupId,
        propertyId,
        order,
      },
    });
    return objectKeysFromSnakeToCamel(result) as SubTypePropertyLink;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createSubTypeGroup({
  id,
  name,
  createdBy,
}: {
  id: string;
  name: string;
  createdBy: string;
}) {
  try {
    const result: SubTypeGroup = await invoke('create_sub_type_group', {
      input: {
        id,
        name,
        createdBy,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createSubTypeProperty({
  id,
  name,
  createdBy,
  inputType,
  shape,
}: {
  id: string;
  name: string;
  createdBy: string;
  inputType: string;
  shape: AllShapes;
}) {
  try {
    const result: RustSubtypeProperty = await invoke(
      'create_sub_type_property',
      {
        input: {
          id,
          name,
          createdBy,
          inputType,
          shape: JSON.stringify(shape), // to avoid deserialization issues with enums
        },
      }
    );
    let parsedResult = parseShape(result);
    return parsedResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export type RustSubtypeProperty = SubTypeProperty & {
  shape: string;
  smartSync: string | null;
};

// lil rust helper
export function parseShape(property: RustSubtypeProperty): SubTypeProperty {
  return {
    ...property,
    shape: JSON.parse(property.shape),
    // smartSync: property.smartSync ? JSON.parse(property.smartSync) : null,
  };
}

export async function createEntrySubType({
  id,
  name,
  createdBy,
  entryType,
}: {
  id: string;
  name: string;
  createdBy: string;
  entryType: GlossaryEntryType;
}) {
  try {
    const result: SubType = await invoke('create_sub_type', {
      input: {
        id,
        name,
        createdBy,
        entryType,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteSubTypeGroup({ id }: { id: string }) {
  try {
    const result = await invoke('delete_sub_type_group', { id });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteSubTypeProperty({ id }: { id: string }) {
  try {
    const result = await invoke('delete_sub_type_property', { id });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteSubType({ id }: { id: string }) {
  try {
    const result = await invoke('delete_sub_type', { id });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSubTypeGroups({
  userId,
  system,
}: {
  userId: string;
  system?: boolean;
}) {
  try {
    const result: { user: RustSubTypeGroup[]; system: RustSubTypeGroup[] } =
      await invoke('get_sub_type_groups', {
        input: { userId, system },
      });
    return {
      user: result.user.map((group) =>
        parseGroupProperties(group as RustSubTypeGroup)
      ),
      system: result.system.map((group) =>
        parseGroupProperties(group as RustSubTypeGroup)
      ),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export interface RustSubTypeGroup extends Omit<SubTypeGroup, 'display'> {
  display: string;
}

export function parseGroupProperties(
  SubTypeGroup: RustSubTypeGroup
): SubTypeGroup {
  return {
    ...SubTypeGroup,
    display: JSON.parse(SubTypeGroup.display || '{}'),
  };
}

export async function getSubTypeProperties({
  userId,
  system,
}: {
  userId: string;
  system?: boolean;
}) {
  try {
    const result: {
      system: RustSubtypeProperty[];
      user: RustSubtypeProperty[];
    } = await invoke('get_sub_type_properties', {
      input: { userId, system },
    });
    return {
      system: result.system.map((prop) => parseShape(prop)),
      user: result.user.map((prop) => parseShape(prop)),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSubTypes({
  userId,
  system,
}: {
  userId: string;
  system?: boolean;
}) {
  try {
    const result: { system: SubType[]; user: SubType[] } = await invoke(
      'get_sub_types',
      {
        input: { userId, system },
      }
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeGroupFromSubType({
  linkIds,
}: {
  linkIds: string[];
}) {
  try {
    const result = await invoke('remove_group_from_sub_type', {
      link_ids: linkIds, // single parameter to snake_case for rust
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeGroupProperty({
  linkId,
  groupId,
  newGroupDisplay,
}: {
  linkId: string;
  groupId: string;
  newGroupDisplay: GenericObject;
}) {
  console.log(linkId, groupId, newGroupDisplay);
  try {
    const result: RustSubTypeGroup = await invoke('remove_group_property', {
      input: {
        linkId,
        groupId,
        newGroupDisplay: JSON.stringify(newGroupDisplay),
      },
    });
    return parseGroupProperties(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function reorderGroupProperties({
  groupId,
  newOrder,
}: {
  groupId: string;
  newOrder: string[];
}) {
  try {
    const result = await invoke('reorder_group_properties', {
      // no input to deserialize and use serde rename. I'm on a roll with these.
      groupId: groupId,
      newOrder: newOrder,
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateSubTypeGroup({
  id,
  name,
  displayName,
  display,
  description,
}: {
  id: string;
  name?: string;
  displayName?: string;
  display?: GenericObject;
  description?: string;
}) {
  try {
    const result = await invoke('update_sub_type_group', {
      input: {
        id,
        name,
        displayName,
        display,
        description,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateSubTypeProperty({
  id,
  name,
  inputType,
  shape,
  displayName,
  smartSync,
}: {
  id: string;
  name?: string;
  inputType?: string;
  shape?: AllShapes;
  displayName?: string;
  smartSync?: SmartSyncRule | null;
}) {
  console.log(smartSync);
  try {
    const result = await invoke('update_sub_type_property', {
      input: {
        id,
        name,
        inputType,
        shape: shape ? JSON.stringify(shape) : undefined, // thanks serialization!
        displayName,
        smartSync: smartSync ? JSON.stringify(smartSync) : undefined, // thanks serialization!
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateSubType({
  id,
  name,
  anchors,
  context,
}: {
  id: string;
  name?: string;
  anchors?: GenericObject;
  context?: string;
}) {
  try {
    const result = await invoke('update_sub_type', {
      input: {
        id,
        name,
        anchors,
        context,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const subTypeCommands = {
  addGroupToSubType,
  createGroupProperty,
  createSubTypeGroup,
  createSubTypeProperty,
  createEntrySubType,
  deleteSubTypeGroup,
  deleteSubTypeProperty,
  deleteSubType,
  getSubTypeGroups,
  getSubTypeProperties,
  getSubTypes,
  removeGroupFromSubType,
  removeGroupProperty,
  reorderGroupProperties,
  updateSubTypeGroup,
  updateSubTypeProperty,
  updateSubType,
};

export default subTypeCommands;

export function objectKeysFromSnakeToCamel(obj: GenericObject): any {
  const newObj: GenericObject = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj;
}
