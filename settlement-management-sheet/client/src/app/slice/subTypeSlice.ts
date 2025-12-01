import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GenericObject,
  GlossaryEntryType,
} from '../../../../shared/types/index.js';
import { cloneDeep, set } from 'lodash';

export type SubTypePropertyTypes =
  | 'text'
  | 'date'
  | 'checkbox'
  | 'range'
  | 'dropdown'
  | 'compound';

export interface SubTypeProperty {
  id: string;
  name: string;
  inputType: SubTypePropertyTypes;
  isAnchor?: boolean;
  shape: GenericObject;
  version?: number;
  [key: string]: any;
}

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
  contentType: 'system' | 'custom';
  schemaGroups?: string[];
  display: Record<string, Record<'columns' | string, any>>;
}

export interface SubTypeGroupLink {
  id: string;
  groupId: string;
  schemaId: string;
  order: number;
}

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
        property: SubTypeProperty;
        side: 'left' | 'right';
      }>
    ) => {
      const { propertyId, property, side } = action.payload;
      if (state.properties.edit[propertyId]) {
        state.properties.edit[propertyId].shape[side] = {
          ...(state.properties.edit[propertyId].shape[side] as GenericObject),
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
      const group = state.groups.edit[groupId];
      if (group && Array.isArray(group.properties)) {
        group.properties.push(cloneDeep(property));
      } else {
        group.properties = [cloneDeep(property)];
      }
      if (!group.display) {
        group.display = {};
      }
      group.display[property.id] = { columns: 4 };
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
      }>
    ) => {
      const { groupId, newOrder } = action.payload;
      const group = state.groups.edit[groupId];
      if (group && Array.isArray(group.properties)) {
        const reordered = newOrder
          .map((id, index) =>
            group.properties!.find((p) => p.propertyId === id)
          )
          .filter((p) => p !== undefined)
          .map((p, index) => ({
            ...p!,
            order: index,
          }));
        group.properties = reordered as SubTypePropertyLink[];
        Object.entries(group.display).forEach(([key, value]) => {
          if (
            !newOrder.includes(
              group.properties.find((p) => p.id === key)?.propertyId!
            )
          ) {
            delete group.display[key];
          }
        });
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
