import { createSelector } from '@reduxjs/toolkit';
import {
  SubType,
  SubTypeProperty,
  SubTypeSliceState,
  SubTypeState,
} from '../slice/subTypeSlice.js';
import { RootState } from '../store.js';

const base = (state: RootState): SubTypeSliceState => state.subType;

export const selectAllSubTypes = createSelector(
  base,
  (subTypeState: SubTypeSliceState): SubType[] => {
    return Object.values(subTypeState.edit);
  }
);

export const selectSubTypeById = (subTypeId: string) =>
  createSelector(base, (subTypeState: SubTypeSliceState) => {
    const subType = subTypeState.edit[subTypeId];
    if (!subType) return null;
    return subType;
  });

export const selectSubTypeGroupById = ({ groupId }: { groupId: string }) =>
  createSelector(base, (subTypeState: SubTypeSliceState) => {
    return subTypeState.groups.edit[groupId] || null;
  });

export const selectSubTypePropertyById = ({
  propertyId,
}: {
  propertyId: string;
}) =>
  createSelector(base, (subTypeState: SubTypeSliceState) => {
    const property = subTypeState.properties.edit[propertyId];
    return property || null;
  });

export const selectSubTypeProperties = createSelector(
  base,
  (subTypeState: SubTypeSliceState): SubTypeProperty[] => {
    return Object.values(subTypeState.properties.edit);
  }
);

export const selectSubTypeGroups = createSelector(
  base,
  (subTypeState: SubTypeSliceState) => {
    return Object.values(subTypeState.groups.edit);
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
