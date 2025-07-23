import { createSelector } from '@reduxjs/toolkit';
import { create, get } from 'lodash';
import { RootState } from '../store.js';

const base = (state: RootState) => state.sidePanel;

export const leftTabs = createSelector([base], (state) => state.leftTabs);
export const rightTabs = createSelector([base], (state) => state.rightTabs);

export const sidePanelOpen = createSelector(
  [base],
  (state) => state.sidePanelOpen
);

export const currentLeftTab = createSelector(
  [base],
  (state) => state.currentLeftTab
);
export const currentRightTab = createSelector(
  [base],
  (state) => state.currentRightTab
);

export const currentLeftIndex = createSelector(
  [base],
  (state) => state.currentLeftTabIndex
);
export const currentRightIndex = createSelector(
  [base],
  (state) => state.currentRightTabIndex
);

export const isSplit = createSelector([base], (state) => state.splitTabs);
export const preventSplit = createSelector(
  [base],
  (state) => state.preventSplit
);

export const breadcrumbs = createSelector([base], (state) => state.breadcrumbs);

export const options = createSelector([base], (state) => state.toolOptions);

export const focusedTab = createSelector([base], (state) => state.focusedTab);

export const selectOptions = (keypath: string) =>
  createSelector([options], (mergedKits) => get(mergedKits, keypath));

export const selectAllTabs = createSelector(
  [leftTabs, rightTabs],
  (leftTabs, rightTabs) => [...leftTabs, ...rightTabs]
);

export const selectAllTabNames = createSelector(
  [leftTabs, rightTabs],
  (leftTabs, rightTabs) => {
    const allTabs = [...leftTabs, ...rightTabs];
    return allTabs.map((tab) => tab.name);
  }
);

export const getUniqueName = createSelector(
  [selectAllTabNames],
  (tabNames) =>
    (baseName = 'Untitled') => {
      let count = 1;

      // Check for existing Untitled tabs
      while (tabNames.includes(`${baseName} (${count})`)) {
        count++;
      }

      return `${baseName} (${count})`;
    }
);

export const isTabDirty = (id: string) =>
  createSelector([leftTabs, rightTabs], (leftTabs, rightTabs) => {
    const allTabs = [...leftTabs, ...rightTabs];
    const tab = allTabs.find((tab) => tab.id === id);
    return tab ? tab.viewState.isDirty : false;
  });

export const sidePanelSelectors = {
  leftTabs,
  rightTabs,
  currentLeftTab,
  currentRightTab,
  currentLeftIndex,
  currentRightIndex,
  isSplit,
  preventSplit,
  breadcrumbs,
  options,
  selectOptions,
  selectAllTabNames,
  isTabDirty,
  focusedTab,
};
