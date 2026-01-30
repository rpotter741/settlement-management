import { createSelector } from '@reduxjs/toolkit';
import {
  SubType,
  SubTypeGroup,
  SubTypeProperty,
  SubTypeSliceState,
  SubTypeState,
} from '../slice/subTypeSlice.js';
import { RootState } from '../store.js';
import { cloneDeep } from 'lodash';

const base = (state: RootState): SubTypeSliceState => state.subType;

export const selectAllSubTypes = createSelector(
  base,
  (subTypeState: SubTypeSliceState): SubType[] => {
    const userSubTypes = Object.values(subTypeState.subtypes.user.edit);
    const systemSubTypes = Object.values(subTypeState.subtypes.system.edit);
    return [...userSubTypes, ...systemSubTypes];
  }
);

export const selectSubTypeById = (subTypeId: string) =>
  createSelector(base, (subTypeState: SubTypeSliceState) => {
    let subType: SubType = subTypeState.subtypes.system.edit[subTypeId];
    if (subType) return subType;
    subType = subTypeState.subtypes.user.edit[subTypeId];
    if (subType) return subType;
    return null;
  });

export const selectSubTypeGroupById = ({ groupId }: { groupId: string }) =>
  createSelector(base, (subTypeState: SubTypeSliceState) => {
    let group = subTypeState.groups.system.edit[groupId];
    if (group) return group;
    group = subTypeState.groups.user.edit[groupId];
    if (group) return group;
    return null;
  });

export const selectSubTypePropertyById = ({
  propertyId,
}: {
  propertyId: string;
}) =>
  createSelector(base, (subTypeState: SubTypeSliceState) => {
    let property = subTypeState.properties.system.edit[propertyId];
    if (property) return property;
    property = subTypeState.properties.user.edit[propertyId];
    if (property) return property;
    return null;
  });

export const selectSubTypeProperties = createSelector(
  base,
  (subTypeState: SubTypeSliceState): SubTypeProperty[] => {
    let userProperties = Object.values(subTypeState.properties.user.edit);
    let systemProperties = Object.values(subTypeState.properties.system.edit);
    return [...userProperties, ...systemProperties];
  }
);

export const selectSubTypePropertyRecord = createSelector(
  base,
  (
    subTypeState: SubTypeSliceState
  ): Record<'system' | 'user', Record<string, SubTypeProperty>> => {
    return {
      system: cloneDeep(subTypeState.properties.system.edit),
      user: cloneDeep(subTypeState.properties.user.edit),
    };
  }
);

export const selectSubTypeGroups = createSelector(
  base,
  (subTypeState: SubTypeSliceState): SubTypeGroup[] => {
    let systemGroups = Object.values(subTypeState.groups.system.edit);
    let userGroups = Object.values(subTypeState.groups.user.edit);
    return [...systemGroups, ...userGroups];
  }
);

export const selectors = {
  selectSubTypeById,
  selectSubTypeGroupById,
  selectSubTypePropertyById,
  selectAllSubTypes,
  selectSubTypeProperties,
  selectSubTypeGroups,
};
