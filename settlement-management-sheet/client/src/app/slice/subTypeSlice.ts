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
  isAnchor?: boolean;
  version?: number;
  refId?: string;
  contentType: 'SYSTEM' | 'CUSTOM';
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
}

interface SubTypeDateProperty extends SubTypePropertyBase {
  inputType: 'date';
  shape: DateShape;
}

export interface SubTypeDropdownProperty extends SubTypePropertyBase {
  inputType: 'dropdown';
  shape: DropdownShape;
  smartSync: SmartSyncRule | null;
}

interface SubTypeCheckboxProperty extends SubTypePropertyBase {
  inputType: 'checkbox';
  shape: CheckboxShape;
}

interface SubTypeRangeProperty extends SubTypePropertyBase {
  inputType: 'range';
  shape: RangeShape;
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
  version: number;
  properties: SubTypePropertyLink[];
  contentType: 'SYSTEM' | 'CUSTOM';
  schemaGroups?: string[];
  display: Record<string, Record<'columns' | string, any>>;
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
  entryType: GlossaryEntryType;
  groups: SubTypeGroupLink[];
  anchors: {
    primary: string | null;
    secondary: string | null;
  };
  [key: string]: any;
};

export type SubTypeState = Record<string, SubType>;

export type SubTypeSliceState = {
  edit: SubTypeState;
  static: SubTypeState;
  properties: Record<'edit' | 'static', Record<string, SubTypeProperty>>;
  groups: Record<'edit' | 'static', Record<string, SubTypeGroup>>;
};

const initialState: SubTypeSliceState = {
  edit: {},
  static: {},
  properties: {
    edit: {},
    static: {},
  },
  groups: {
    edit: {},
    static: {},
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
      }>
    ) => {
      const { subType } = action.payload;
      const { id } = subType;
      if (!state.edit[id]) {
        //avoid overwriting existing subTypes
        state.edit[id] = cloneDeep(subType);
        state.static[id] = cloneDeep(subType);
      }
    },
    addSubTypeProperty: (
      state,
      action: PayloadAction<{
        properties: SubTypeProperty[];
      }>
    ) => {
      const { properties } = action.payload;
      properties.forEach((property) => {
        state.properties.edit[property.id] = cloneDeep(property);
        state.properties.static[property.id] = cloneDeep(property);
      });
    },
    updateSubTypeProperty: (
      state,
      action: PayloadAction<{
        propertyId: string;
        property: SubTypeProperty;
      }>
    ) => {
      const { propertyId, property } = action.payload;
      if (state.properties.edit[propertyId]) {
        state.properties.edit[propertyId] = {
          ...state.properties.edit[propertyId],
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
      }>
    ) => {
      const { propertyId, property, side } = action.payload;
      if (state.properties.edit[propertyId]) {
        ((state.properties.edit[propertyId] as SubTypeCompoundProperty).shape[
          side as keyof CompoundShape
        ] as NonCompoundProperties) = {
          ...((state.properties.edit[propertyId] as SubTypeCompoundProperty)
            .shape[side] as NonCompoundProperties),
          ...property,
        };
      }
    },
    addSubTypeGroup: (
      state,
      action: PayloadAction<{
        groups: SubTypeGroup[];
      }>
    ) => {
      const { groups } = action.payload;
      groups.forEach((group) => {
        state.groups.edit[group.id] = cloneDeep(group);
        state.groups.static[group.id] = cloneDeep(group);
      });
    },
    addPropertyToGroup: (
      state,
      action: PayloadAction<{
        groupId: string;
        property: SubTypePropertyLink;
      }>
    ) => {
      const { groupId, property } = action.payload;
      console.log(property);
      const group = state.groups.edit[groupId];
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
      }>
    ) => {
      const { groupId, updates } = action.payload;
      const group = state.groups.edit[groupId];
      if (group) {
        state.groups.edit[groupId] = {
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
      }>
    ) => {
      const { groupId, newOrder, newDisplay } = action.payload;
      const group = state.groups.edit[groupId];
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
    reorderSubTypeGroups: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        newGroupOrder: string[];
      }>
    ) => {
      const { subTypeId, newGroupOrder } = action.payload;
      const subType = state.edit[subTypeId];
      if (subType) {
        subType.groupOrder = [...newGroupOrder];
      }
    },
    deleteProperty: (
      state,
      action: PayloadAction<{
        propertyId: string;
      }>
    ) => {
      const { propertyId } = action.payload;
      delete state.properties.edit[propertyId];
      delete state.properties.static[propertyId];
    },
    deleteGroup: (
      state,
      action: PayloadAction<{
        groupId: string;
      }>
    ) => {
      const { groupId } = action.payload;
      delete state.groups.edit[groupId];
      delete state.groups.static[groupId];
    },
    addGroupsToSubType: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groups: SubTypeGroupLink[];
      }>
    ) => {
      const { subTypeId, groups } = action.payload;
      const subType = state.edit[subTypeId];
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
      }>
    ) => {
      const { subTypeId, linkIds } = action.payload;
      const subType = state.edit[subTypeId];
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
      }>
    ) => {
      const { subtypeId, anchors } = action.payload;
      const subtype = state.edit[subtypeId];
      if (subtype) {
        subtype.anchors = anchors;
      }
    },
    updateSubTypeName: (
      state,
      action: PayloadAction<{
        subtypeId: string;
        name: string;
      }>
    ) => {
      const { subtypeId, name } = action.payload;
      const subtype = state.edit[subtypeId];
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
      const subtype = state.edit[subtypeId];
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
  reorderSubTypeGroups,
  deleteProperty,
  updateSubTypeGroup,
  deleteGroup,
  addGroupsToSubType,
  removeGroupsFromSubtype,
  updateSubTypeAnchors,
  updateSubTypeName,
  updateSubTypeContext,
  // addSubTypeGroup,
  // reorderSubTypeGroups,
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
