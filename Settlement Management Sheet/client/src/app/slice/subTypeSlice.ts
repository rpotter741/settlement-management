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

export type SubTypeProperty = {
  id: string;
  name: string;
  type: SubTypePropertyTypes;
  [key: string]: any;
};

export type SubTypeGroup = {
  id: string;
  name: string;
  propertyOrder: string[];
  propertyData: Record<string, any>;
};

export type SubType = {
  id: string;
  entryType: GlossaryEntryType;
  groupData: Record<string, SubTypeGroup>;
  groupOrder: string[];
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
};

function groupExists(
  state: SubTypeState,
  subTypeId: string,
  groupId: string
): SubTypeGroup | false {
  const subType = state[subTypeId];
  if (!subType) return false;
  const group = subType.groupData[groupId];
  return group ? group : false;
}

function propertyExists(
  state: SubTypeState,
  subTypeId: string,
  groupId: string,
  propertyId: string
): SubTypeProperty | false {
  const subType = state[subTypeId];
  if (!subType) return false;
  const group = subType.groupData[groupId];
  if (!group) return false;
  const property = group.propertyData[propertyId];
  return property ? property : false;
}

const initialState: Record<'edit' | 'static', SubTypeState> = {
  edit: {},
  static: {},
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
      console.log('Adding SubType:', action.payload.subType);
      const { subType } = action.payload;
      const { id } = subType;
      if (!state.edit[id]) {
        //avoid overwriting existing subTypes
        state.edit[id] = cloneDeep(subType);
        state.static[id] = cloneDeep(subType);
      }
    },
    addSubTypeGroup: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        group: {
          id: string;
          name: string;
          propertyOrder: string[];
          propertyData: GenericObject;
        };
      }>
    ) => {
      const { subTypeId, group } = action.payload;
      const subType = state.edit[subTypeId];
      if (!subType) return;
      subType.groupOrder.push(group.id);
      subType.groupData[group.id] = group;
    },
    reorderSubTypeGroups: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        newOrder: string[];
      }>
    ) => {
      const { subTypeId, newOrder } = action.payload;
      const subType = state.edit[subTypeId];
      if (!subType) return;
      subType.groupOrder = newOrder;
    },
    addSubTypeProperty: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupId: string;
        property: {
          id: string;
          name: string;
          type: SubTypePropertyTypes;
          [key: string]: any;
        };
      }>
    ) => {
      const { subTypeId, groupId, property } = action.payload;
      const group = groupExists(state.edit, subTypeId, groupId);
      if (!group) return;
      group.propertyOrder.push(property.id);
      group.propertyData[property.id] = property;
    },
    updateSubTypeProperty: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupId: string;
        propertyId: string;
        keypath: string;
        value: any;
      }>
    ) => {
      const { subTypeId, groupId, propertyId, keypath, value } = action.payload;
      const property = propertyExists(
        state.edit,
        subTypeId,
        groupId,
        propertyId
      );
      if (!property) return;
      set(property, keypath, value);
    },
    changeSubTypeProperty: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupId: string;
        propertyId: string;
        property: GenericObject;
      }>
    ) => {
      const { subTypeId, groupId, propertyId } = action.payload;
      const group = groupExists(state.edit, subTypeId, groupId);
      if (!group) return;
      const property = group.propertyData[propertyId];
      if (!property) return;
      group.propertyData[propertyId] = action.payload.property;
    },
    updateSubTypeAnchor: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        anchor: 'primary' | 'secondary';
        value: string | null;
      }>
    ) => {
      const { subTypeId, anchor, value } = action.payload;
      const subType = state.edit[subTypeId];
      if (!subType) return;
      subType.anchors[anchor] = value;
    },
    updateSubTypeName: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        name: string;
      }>
    ) => {
      const { subTypeId, name } = action.payload;
      const subType = state.edit[subTypeId];
      if (!subType) return;
      subType.name = name;
    },
    updateSubTypeSubProperty: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupId: string;
        propertyId: string;
        side: 'left' | 'right';
        keypath: string;
        value: any;
      }>
    ) => {
      const { subTypeId, groupId, propertyId, side, keypath, value } =
        action.payload;
      const property = propertyExists(
        state.edit,
        subTypeId,
        groupId,
        propertyId
      );
      if (!property) return;
      const subProperty = property[side];
      if (!subProperty) return;
      set(subProperty, keypath, value);
    },
    changeSubTypeSubProperty: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupId: string;
        propertyId: string;
        side: 'left' | 'right';
        subProperty: SubTypeProperty;
      }>
    ) => {
      const { subTypeId, groupId, propertyId, side } = action.payload;
      const property = propertyExists(
        state.edit,
        subTypeId,
        groupId,
        propertyId
      );
      if (!property) return;
      if (!property[side]) return;
      property[side] = action.payload.subProperty;
    },
    changeSubTypeGroupName: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupId: string;
        name: string;
      }>
    ) => {
      const { subTypeId, groupId, name } = action.payload;
      const group = groupExists(state.edit, subTypeId, groupId);
      if (!group) return;
      group.name = name;
    },
    removeSubTypeGroup: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupId: string;
      }>
    ) => {
      const { subTypeId, groupId } = action.payload;
      const group = groupExists(state.edit, subTypeId, groupId);
      if (!group) return;
      delete state.edit[subTypeId].groupData[groupId];
      state.edit[subTypeId].groupOrder = state.edit[
        subTypeId
      ].groupOrder.filter((id: string) => id !== groupId);
    },
    updateAllSubTypeGroupData: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupData: Record<string, SubTypeGroup>;
      }>
    ) => {
      const { subTypeId, groupData } = action.payload;
      const subType = state.edit[subTypeId];
      if (!subType) return;
      subType.groupData = groupData;
    },
    removeSubTypeProperty: (
      state,
      action: PayloadAction<{
        subTypeId: string;
        groupId: string;
        propertyId: string;
      }>
    ) => {
      const { subTypeId, groupId, propertyId } = action.payload;
      const group = groupExists(state.edit, subTypeId, groupId);
      if (!group) return;
      delete group.propertyData[propertyId];
      group.propertyOrder = group.propertyOrder.filter(
        (id: string) => id !== propertyId
      );
    },
    syncStaticWithEdit: (
      state,
      action: PayloadAction<{
        subTypeId: string;
      }>
    ) => {
      const { subTypeId } = action.payload;
      const editSubType = state.edit[subTypeId];
      if (!editSubType) return;
      state.static[subTypeId] = cloneDeep(editSubType);
    },
  },
});

export const {
  addSubType,
  addSubTypeGroup,
  reorderSubTypeGroups,
  addSubTypeProperty,
  updateSubTypeProperty,
  changeSubTypeProperty,
  updateSubTypeAnchor,
  updateSubTypeName,
  updateSubTypeSubProperty,
  changeSubTypeSubProperty,
  changeSubTypeGroupName,
  removeSubTypeGroup,
  updateAllSubTypeGroupData,
  removeSubTypeProperty,
  syncStaticWithEdit,
} = subTypeSlice.actions;

export default subTypeSlice.reducer;
