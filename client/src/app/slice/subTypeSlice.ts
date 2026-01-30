import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlossaryEntryType } from '../../../../shared/types/index.js';
import { cloneDeep, set } from 'lodash';
import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';

export type SubTypePropertyTypes =
  | 'text'
  | 'date'
  | 'checkbox'
  | 'range'
  | 'dropdown'
  | 'compound';

interface SubTypePropertyBase {
  id: string;
  name: string;
  smartSync?: SmartSyncRule | null;
  displayName?: string;
}

interface TextShape {
  inputType: 'text' | 'number' | 'richText';
  defaultValue: string;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

interface DropdownShape {
  selectType: 'single' | 'multi';
  optionType: 'list' | 'entryType';
  defaultList?: string[];
  maxSelections?: number;
  relationship?: GlossaryEntryType[];
  options?: string[];
  isCompound: boolean;
}

interface CheckboxShape {
  defaultChecked: boolean;
}

interface RangeShape {
  isNumber: boolean;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  options?: string[];
}

interface DateShape {}

interface SubTypeTextProperty extends SubTypePropertyBase {
  inputType: 'text';
  shape: TextShape;
  system: boolean;
}

interface SubTypeDateProperty extends SubTypePropertyBase {
  inputType: 'date';
  shape: DateShape;
  system: boolean;
}

export interface SubTypeDropdownProperty extends SubTypePropertyBase {
  inputType: 'dropdown';
  shape: DropdownShape;
  smartSync: SmartSyncRule | null;
  system: boolean;
}

interface SubTypeCheckboxProperty extends SubTypePropertyBase {
  inputType: 'checkbox';
  shape: CheckboxShape;
  system: boolean;
}

interface SubTypeRangeProperty extends SubTypePropertyBase {
  inputType: 'range';
  shape: RangeShape;
  system: boolean;
}

export type NonCompoundShapes =
  | TextShape
  | DateShape
  | DropdownShape
  | CheckboxShape
  | RangeShape;

export type NonCompoundProperties =
  | SubTypeTextProperty
  | SubTypeDateProperty
  | SubTypeDropdownProperty
  | SubTypeCheckboxProperty
  | SubTypeRangeProperty;

export interface CompoundShape {
  left: NonCompoundProperties;
  right: NonCompoundProperties;
}

export type AllShapes = NonCompoundShapes | CompoundShape;

export interface SubTypeCompoundProperty extends SubTypePropertyBase {
  inputType: 'compound';
  shape: CompoundShape;
  smartSync: SmartSyncRule | null;
  system: boolean;
}

/**
 * SubTypeProperty exported as a discriminated union:
 * - specific non-compound property interfaces (text, date, dropdown, checkbox, range)
 * - compound property interface
 */
export type SubTypeProperty = NonCompoundProperties | SubTypeCompoundProperty;

export interface SubTypePropertyLink {
  propertyId: string;
  groupId: string;
  id: string;
  order: number;
}

export interface SubTypeGroup {
  id: string;
  name: string;
  displayName: string;
  description: string;
  properties: SubTypePropertyLink[];
  schemaGroups?: string[];
  display: Record<string, Record<'columns' | string, any>>;
  system: boolean;
}

export interface SubTypeGroupLink {
  id: string;
  groupId: string;
  schemaId: string;
  order: number;
}

export type SemanticAnchors = {
  primary: string | null;
  secondary: string | null;
};

export type SubType = {
  id: string;
  name: string;
  entryType: GlossaryEntryType;
  groups: SubTypeGroupLink[];
  anchors: {
    primary: string | null;
    secondary: string | null;
  };
  context: string[];
  system: boolean;
};

export type SubTypeState = Record<string, SubType>;

export type SubTypeSliceState = {
  subtypes: {
    user: {
      edit: SubTypeState;
      static: SubTypeState;
    };
    system: {
      edit: SubTypeState;
      static: SubTypeState;
    };
  };
  properties: {
    user: {
      edit: Record<string, SubTypeProperty>;
      static: Record<string, SubTypeProperty>;
    };
    system: {
      edit: Record<string, SubTypeProperty>;
      static: Record<string, SubTypeProperty>;
    };
  };
  groups: {
    user: {
      edit: Record<string, SubTypeGroup>;
      static: Record<string, SubTypeGroup>;
    };
    system: {
      edit: Record<string, SubTypeGroup>;
      static: Record<string, SubTypeGroup>;
    };
  };
};

const initialState: SubTypeSliceState = {
  subtypes: {
    user: {
      edit: {},
      static: {},
    },
    system: {
      edit: {},
      static: {},
    },
  },
  properties: {
    user: {
      edit: {},
      static: {},
    },
    system: {
      edit: {},
      static: {},
    },
  },
  groups: {
    user: {
      edit: {},
      static: {},
    },
    system: {
      edit: {},
      static: {},
    },
  },
};

const subTypeSlice = createSlice({
  name: 'subType',
  initialState,
  reducers: {
    addSubType: (
      state,
      action: PayloadAction<{
        subType: any;
        system: boolean;
      }>
    ) => {
      const { subType, system } = action.payload;
      const { id } = subType;
      if (!state.subtypes[system ? 'system' : 'user'].edit[id]) {
        //avoid overwriting existing subTypes
        state.subtypes[system ? 'system' : 'user'].edit[id] =
          cloneDeep(subType);
        state.subtypes[system ? 'system' : 'user'].static[id] =
          cloneDeep(subType);
      }
    },
    addSubTypeProperty: (
      state,
      action: PayloadAction<{
        properties: SubTypeProperty[];
        system: boolean;
      }>
    ) => {
      const { properties, system } = action.payload;
      properties.forEach((property) => {
        state.properties[system ? 'system' : 'user'].edit[property.id] =
          cloneDeep(property);
        state.properties[system ? 'system' : 'user'].static[property.id] =
          cloneDeep(property);
      });
    },
    updateSubTypeProperty: (
      state,
      action: PayloadAction<{
        propertyId: string;
        property: SubTypeProperty;
        system: boolean;
      }>
    ) => {
      const { propertyId, property, system } = action.payload;
      if (state.properties[system ? 'system' : 'user'].edit[propertyId]) {
        state.properties[system ? 'system' : 'user'].edit[propertyId] = {
          ...state.properties[system ? 'system' : 'user'].edit[propertyId],
          ...property,
        };
      }
    },
    updateSubTypeSubProperty: (
      state,
      action: PayloadAction<{
        propertyId: string;
        property: NonCompoundProperties;
        side: 'left' | 'right';
        system: boolean;
      }>
    ) => {
      const { propertyId, property, side, system } = action.payload;
      if (state.properties[system ? 'system' : 'user'].edit[propertyId]) {
        ((
          state.properties[system ? 'system' : 'user'].edit[
            propertyId
          ] as SubTypeCompoundProperty
        ).shape[side as keyof CompoundShape] as NonCompoundProperties) = {
          ...((
            state.properties[system ? 'system' : 'user'].edit[
              propertyId
            ] as SubTypeCompoundProperty
          ).shape[side] as NonCompoundProperties),
          ...property,
        };
      }
    },
    addSubTypeGroup: (
      state,
      action: PayloadAction<{
        groups: SubTypeGroup[];
        system: boolean;
      }>
    ) => {
      const { groups, system } = action.payload;
      groups.forEach((group) => {
        state.groups[system ? 'system' : 'user'].edit[group.id] =
          cloneDeep(group);
        state.groups[system ? 'system' : 'user'].static[group.id] =
          cloneDeep(group);
      });
    },
    addPropertyToGroup: (
      state,
      action: PayloadAction<{
        groupId: string;
        property: SubTypePropertyLink;
        system: boolean;
      }>
    ) => {
      const { groupId, property, system } = action.payload;
      const group = state.groups[system ? 'system' : 'user'].edit[groupId];
      if (group) {
        let properties = cloneDeep(group?.properties);
        if (Array.isArray(properties)) {
          properties.push(property);
        } else {
          properties = [property];
        }
        let display = cloneDeep(group?.display || {});
        if (!display[property.propertyId]) {
          display[property.propertyId] = { columns: 4 };
        }
        group.properties = properties;
        group.display = display;
      }
    },
    updateSubTypeGroup: (
      state,
      action: PayloadAction<{
        groupId: string;
        updates: Partial<SubTypeGroup>;
        system: boolean;
      }>
    ) => {
      const { groupId, updates, system } = action.payload;
      const group = state.groups[system ? 'system' : 'user'].edit[groupId];
      if (group) {
        state.groups[system ? 'system' : 'user'].edit[groupId] = {
          ...group,
          ...updates,
        };
      }
    },
    reorderGroupProperties: (
      state,
      action: PayloadAction<{
        groupId: string;
        newOrder: string[]; // array of property ids
        newDisplay: Record<string, Record<'columns' | string, any>>;
        system: boolean;
      }>
    ) => {
      const { groupId, newOrder, newDisplay, system } = action.payload;
      const group = state.groups[system ? 'system' : 'user'].edit[groupId];
      if (group && Array.isArray(group.properties)) {
        const reordered = newOrder.reduce((acc, propertyId, index) => {
          const propLink = group.properties.find(
            (p) => p.propertyId === propertyId
          );
          if (!propLink) {
            delete group.display[propertyId];
            return acc;
          }
          acc.push({ ...propLink, order: index });
          return acc;
        }, [] as SubTypePropertyLink[]);
        group.properties = reordered;
        group.display = newDisplay;
      }
    },
    deleteProperty: (
      state,
      action: PayloadAction<{
        propertyId: string;
        system: boolean;
      }>
    ) => {
      const { propertyId, system } = action.payload;
      delete state.properties[system ? 'system' : 'user'].edit[propertyId];
      delete state.properties[system ? 'system' : 'user'].static[propertyId];
    },
    deleteGroup: (
      state,
      action: PayloadAction<{
        groupId: string;
        system: boolean;
      }>
    ) => {
      const { groupId, system } = action.payload;
      delete state.groups[system ? 'system' : 'user'].edit[groupId];
      delete state.groups[system ? 'system' : 'user'].static[groupId];
    },
    addGroupsToSubType: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groups: SubTypeGroupLink[];
        system: boolean;
      }>
    ) => {
      const { subTypeId, groups, system } = action.payload;
      const subType =
        state.subtypes[system ? 'system' : 'user'].edit[subTypeId];
      if (subType && Array.isArray(subType.groups)) {
        subType.groups.push(...groups.map((group) => cloneDeep(group)));
      } else if (subType) {
        subType.groups = groups.map((group) => cloneDeep(group));
      }
    },
    removeGroupsFromSubtype: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        linkIds: string[];
        system: boolean;
      }>
    ) => {
      const { subTypeId, linkIds, system } = action.payload;
      const subType =
        state.subtypes[system ? 'system' : 'user'].edit[subTypeId];
      if (subType && Array.isArray(subType.groups)) {
        subType.groups = subType.groups.filter(
          (group) => !linkIds.includes(group.id)
        );
      }
    },
    updateSubTypeAnchors: (
      state,
      action: PayloadAction<{
        subtypeId: string;
        anchors: SemanticAnchors;
        system: boolean;
      }>
    ) => {
      const { subtypeId, anchors, system } = action.payload;
      const subtype =
        state.subtypes[system ? 'system' : 'user'].edit[subtypeId];
      if (subtype) {
        subtype.anchors = anchors;
      }
    },
    updateSubTypeName: (
      state,
      action: PayloadAction<{
        subtypeId: string;
        name: string;
        system: boolean;
      }>
    ) => {
      const { subtypeId, name, system } = action.payload;
      const subtype =
        state.subtypes[system ? 'system' : 'user'].edit[subtypeId];
      if (subtype) {
        subtype.name = name;
      }
    },
    updateSubTypeContext: (
      state,
      action: PayloadAction<{
        subtypeId: string;
        context: string[];
      }>
    ) => {
      const { subtypeId, context } = action.payload;
      const subtype = state.subtypes.user.edit[subtypeId];
      if (subtype) {
        subtype.context = context;
      }
    },
    someFunction: (
      state,
      action: PayloadAction<{
        /* payload fields */
      }>
    ) => {
      // reducer logic here
    },
  },
});

export const {
  addSubType,
  addSubTypeProperty,
  updateSubTypeProperty,
  updateSubTypeSubProperty,
  addSubTypeGroup,
  addPropertyToGroup,
  reorderGroupProperties,
  deleteProperty,
  updateSubTypeGroup,
  deleteGroup,
  addGroupsToSubType,
  removeGroupsFromSubtype,
  updateSubTypeAnchors,
  updateSubTypeName,
  updateSubTypeContext,
  // addSubTypeGroup,
  // updateSubTypeProperty,
  // changeSubTypeProperty,
  // updateSubTypeAnchor,
  // updateSubTypeName,
  // updateSubTypeSubProperty,
  // changeSubTypeSubProperty,
  // changeSubTypeGroupName,
  // removeSubTypeGroup,
  // updateAllSubTypeGroupData,
  // removeSubTypeProperty,
  // syncStaticWithEdit,
  // updateSubTypeEntryType,
  // changeSubTypeGroup,
  // deleteSubType,
} = subTypeSlice.actions;

export default subTypeSlice.reducer;
