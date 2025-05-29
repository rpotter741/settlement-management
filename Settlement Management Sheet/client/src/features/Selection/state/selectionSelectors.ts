import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { SelectionState, SelectionObject } from './types.js';
import { SelectionFeatures } from './selectionSlice.js';

const glossaryBase = (state: RootState): SelectionState =>
  state.selection.glossary;
const storyThreadsBase = (state: RootState): SelectionState =>
  state.selection.storyThreads;
const upgradePanelBase = (state: RootState): SelectionState =>
  state.selection.upgradePanel;
const listenersBase = (state: RootState): SelectionState =>
  state.selection.listeners;

export const selectSelectedIds = (feature: SelectionFeatures) =>
  createSelector(
    (state: RootState) => state.selection[feature],
    (selectionState: SelectionState) => selectionState.selectedIds
  );
export const selectLastSelectedId = (feature: SelectionFeatures) =>
  createSelector(
    (state: RootState) => state.selection[feature],
    (selectionState: SelectionState) => selectionState.lastSelectedId
  );
export const selectIsFocused = (feature: SelectionFeatures) =>
  createSelector(
    (state: RootState) => state.selection[feature],
    (selectionState: SelectionState) => selectionState.isFocused
  );
export const selectVisibleNodes = (
  feature: SelectionFeatures,
  tree: SelectionObject[],
  renderState: Record<string, { expanded: boolean }>
) =>
  createSelector(
    (state: RootState) => state.selection[feature],
    () => {
      if (!tree || !renderState) return [];
      const visible: string[] = [];
      const traverse = (node: SelectionObject) => {
        visible.push(node.id);
        if (
          node.type === 'folder' &&
          renderState[node.id]?.expanded &&
          node.children
        ) {
          node.children.forEach((childNode: SelectionObject) => {
            traverse(childNode);
          });
        }
      };
      tree.forEach((node: SelectionObject) => {
        traverse(node);
      });
      return visible;
    }
  );
export const selectGlossarySelectedIds = () => selectSelectedIds('glossary');
export const selectStoryThreadsSelectedIds = () =>
  selectSelectedIds('storyThreads');
export const selectUpgradePanelSelectedIds = () =>
  selectSelectedIds('upgradePanel');
export const selectListenersSelectedIds = () => selectSelectedIds('listeners');
export const selectGlossaryLastSelectedId = () =>
  selectLastSelectedId('glossary');
export const selectStoryThreadsLastSelectedId = () =>
  selectLastSelectedId('storyThreads');
export const selectUpgradePanelLastSelectedId = () =>
  selectLastSelectedId('upgradePanel');
export const selectListenersLastSelectedId = () =>
  selectLastSelectedId('listeners');
export const selectGlossaryIsFocused = () => selectIsFocused('glossary');
export const selectStoryThreadsIsFocused = () =>
  selectIsFocused('storyThreads');
export const selectUpgradePanelIsFocused = () =>
  selectIsFocused('upgradePanel');
export const selectListenersIsFocused = () => selectIsFocused('listeners');
export const selectGlossaryVisibleNodes = (
  tree: SelectionObject[],
  renderState: Record<string, { expanded: boolean }>
) => selectVisibleNodes('glossary', tree, renderState);
export const selectStoryThreadsVisibleNodes = (
  tree: SelectionObject[],
  renderState: Record<string, { expanded: boolean }>
) => selectVisibleNodes('storyThreads', tree, renderState);
export const selectUpgradePanelVisibleNodes = (
  tree: SelectionObject[],
  renderState: Record<string, { expanded: boolean }>
) => selectVisibleNodes('upgradePanel', tree, renderState);
export const selectListenersVisibleNodes = (
  tree: SelectionObject[],
  renderState: Record<string, { expanded: boolean }>
) => selectVisibleNodes('listeners', tree, renderState);
export const selectGlossaryState = createSelector(
  glossaryBase,
  (glossaryState: SelectionState) => glossaryState
);
export const selectStoryThreadsState = createSelector(
  storyThreadsBase,
  (storyThreadsState: SelectionState) => storyThreadsState
);
export const selectUpgradePanelState = createSelector(
  upgradePanelBase,
  (upgradePanelState: SelectionState) => upgradePanelState
);
export const selectListenersState = createSelector(
  listenersBase,
  (listenersState: SelectionState) => listenersState
);
