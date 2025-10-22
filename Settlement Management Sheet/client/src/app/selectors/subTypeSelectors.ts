import { createSelector } from '@reduxjs/toolkit';
import {
  SubType,
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

export const selectSubTypeGroupById = ({
  subTypeId,
  groupId,
}: {
  subTypeId: string;
  groupId: string;
}) =>
  createSelector(base, (subTypeState: SubTypeSliceState) => {
    const subTypes = subTypeState.edit[subTypeId]?.groupData;
    if (!subTypes) return null;
    const subTypeGroup = subTypes[groupId];
    return subTypeGroup || null;
  });

export const selectSubTypePropertyById = ({
  subTypeId,
  groupId,
  propertyId,
}: {
  subTypeId: string;
  groupId: string;
  propertyId: string;
}) =>
  createSelector(base, (subTypeState: SubTypeSliceState) => {
    const subTypes = subTypeState.edit[subTypeId]?.groupData;
    return subTypes?.[groupId]?.propertyData[propertyId] || null;
  });

export const selectors = {
  selectSubTypeById,
  selectSubTypeGroupById,
  selectSubTypePropertyById,
};
