import { createSelector } from '@reduxjs/toolkit';

const base = (state) => state.sidePanel;

export const tabs = createSelector([base], (state) => state.tabs);
export const currentTab = createSelector([base], (state) => state.currentTab);
export const currentIndex = createSelector(
  [base],
  (state) => state.currentTabIndex
);
export const breadcrumbs = createSelector([base], (state) => state.breadcrumbs);

export const sidePanelSelectors = {
  tabs,
  currentTab,
  currentIndex,
  breadcrumbs,
};
