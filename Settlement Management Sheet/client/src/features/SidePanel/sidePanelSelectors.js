import { createSelector } from '@reduxjs/toolkit';

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
};
