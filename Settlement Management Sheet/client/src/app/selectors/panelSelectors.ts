import { createSelector } from '@reduxjs/toolkit';
import { create, get } from 'lodash';
import { RootState } from '../store.js';

const base = (state: RootState) => state.panel;

export const panelOpen = createSelector([base], (state) => state.panelOpen);

export const breadcrumbs = createSelector([base], (state) => state.breadcrumbs);

export const options = createSelector([base], (state) => state.toolOptions);

export const selectOptions = (keypath: string) =>
  createSelector([options], (mergedKits) => get(mergedKits, keypath));

export const panelSelectors = {
  panelOpen,
  breadcrumbs,
  options,
  selectOptions,
};
