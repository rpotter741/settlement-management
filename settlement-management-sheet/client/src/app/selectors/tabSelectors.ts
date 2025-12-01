import { createSelector } from '@reduxjs/toolkit';
import { create, get } from 'lodash';
import { RootState } from '../store.js';

const base = (state: RootState) => state.tabs;

export const leftTabs = createSelector([base], (state) =>
  state.left.order.map((id) => state.left.data[id])
);
export const rightTabs = createSelector([base], (state) =>
  state.right.order.map((id) => state.right.data[id])
);

export const currentLeftTab = createSelector(
  [base],
  (state) => state.left.currentId
);
export const currentRightTab = createSelector(
  [base],
  (state) => state.right.currentId
);

export const currentLeftIndex = createSelector(
  [base],
  (state) => state.left.currentIndex
);
export const currentRightIndex = createSelector(
  [base],
  (state) => state.right.currentIndex
);

export const isSplit = createSelector([base], (state) => state.splitTabs);
export const preventSplit = createSelector(
  [base],
  (state) => state.preventSplit
);

export const focusedTab = createSelector([base], (state) => state.focusedTab);

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

export const isTabDirty = (tabId: string) =>
  createSelector([base], (state) => {
    const tab = get(state.left.data, tabId) || get(state.right.data, tabId);
    if (!tab) {
      console.warn(`Tab with id ${tabId} not found`);
      return false;
    }
    return Object.keys(tab.viewState.dirtyKeypaths || {}).length > 0;
  });

export const tabSelectors = {
  leftTabs,
  rightTabs,
  currentLeftTab,
  currentRightTab,
  currentLeftIndex,
  currentRightIndex,
  isSplit,
  preventSplit,
  selectAllTabNames,
  isTabDirty,
  focusedTab,
};
