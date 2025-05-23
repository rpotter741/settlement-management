import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';

const base = (state) => state.sidePanel;

export const leftTabs = createSelector([base], (state) => state.leftTabs);
export const rightTabs = createSelector([base], (state) => state.rightTabs);

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
  (state) => state.currentTabIndex
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

export const selectOptions = (keypath) =>
  createSelector([options], (mergedKits) => get(mergedKits, keypath));

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
};
