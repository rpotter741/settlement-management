import { invoke } from '@tauri-apps/api/core';
import { GenericObject } from '../../../../shared/types/common.ts';
import { GlossaryEntryType } from '../../../../shared/types/index.ts';
import {
  AllShapes,
  SemanticAnchors,
  SubType,
  SubTypeGroup,
  SubTypeGroupLink,
  SubTypeProperty,
  SubTypePropertyLink,
} from '../slice/subTypeSlice.ts';
import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.tsx';
import {
  objectKeysFromSnakeToCamel,
  parseGroupProperties,
  RustSubTypeGroup,
} from './userSubtype.ts';

export async function sysAddGroupToSubType({
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
    const result: SubTypeGroupLink = await invoke('sys_add_group_to_subtype', {
      input: {
        id,
        groupId,
        subtypeId,
        order,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function sysCreateGroupProperty({
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
    const result: GenericObject = await invoke('sys_create_group_property', {
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

export async function sysCreateSubTypeGroup({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  try {
    const result: SubTypeGroup = await invoke('sys_create_sub_type_group', {
      input: {
        id,
        name,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sysCreateSubTypeProperty({
  id,
  name,
  inputType,
  shape,
}: {
  id: string;
  name: string;
  inputType: string;
  shape: AllShapes;
}) {
  try {
    const result: RustSubtypeProperty = await invoke(
      'sys_create_sub_type_property',
      {
        input: {
          id,
          name,
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

export async function sysCreateEntrySubType({
  id,
  name,
  entryType,
}: {
  id: string;
  name: string;
  entryType: GlossaryEntryType;
}) {
  try {
    const result: SubType = await invoke('sys_create_sub_type', {
      input: {
        id,
        name,
        entryType,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sysDeleteSubTypeGroup({ id }: { id: string }) {
  try {
    const result = await invoke('sys_delete_sub_type_group', { id });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sysDeleteSubTypeProperty({ id }: { id: string }) {
  try {
    const result = await invoke('sys_delete_sub_type_property', { id });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sysDeleteSubType({ id }: { id: string }) {
  try {
    const result = await invoke('sys_delete_sub_type', { id });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sysRemoveGroupFromSubType({
  linkIds,
}: {
  linkIds: string[];
}) {
  try {
    const result = await invoke('sys_remove_group_from_sub_type', {
      link_ids: linkIds, // single parameter to snake_case for rust
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sysRemoveGroupProperty({
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
    const result: RustSubTypeGroup = await invoke('sys_remove_group_property', {
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

export async function sysReorderGroupProperties({
  groupId,
  newOrder,
}: {
  groupId: string;
  newOrder: string[];
}) {
  try {
    const result = await invoke('sys_reorder_group_properties', {
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

export async function sysUpdateSubTypeGroup({
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
    const result = await invoke('sys_update_sub_type_group', {
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

export async function sysUpdateSubTypeProperty({
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
  try {
    const result = await invoke('sys_update_sub_type_property', {
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

export async function sysUpdateSubType({
  id,
  name,
  anchors,
  context,
}: {
  id: string;
  name?: string;
  anchors?: SemanticAnchors;
  context?: string;
}) {
  try {
    const result = await invoke('sys_update_sub_type', {
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

const sysSubTypeCommands = {
  sysAddGroupToSubType,
  sysCreateGroupProperty,
  sysCreateSubTypeGroup,
  sysCreateSubTypeProperty,
  sysCreateEntrySubType,
  sysDeleteSubTypeGroup,
  sysDeleteSubTypeProperty,
  sysDeleteSubType,
  sysRemoveGroupFromSubType,
  sysRemoveGroupProperty,
  sysReorderGroupProperties,
  sysUpdateSubTypeGroup,
  sysUpdateSubTypeProperty,
  sysUpdateSubType,
};

export default sysSubTypeCommands;
