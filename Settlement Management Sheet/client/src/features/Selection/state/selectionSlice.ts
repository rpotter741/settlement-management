import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectionState, SelectionObject } from './types.js';
import { cloneDeep } from 'lodash';
import flattenVisibleNodes from '../helpers/flattenVisibleNodes.js';

const initialState: SelectionState = {
  selectedIds: [],
  lastSelectedId: null,
  isFocused: false,
};

export interface SelectionStateTree {
  glossary: SelectionState;
  storyThreads: SelectionState;
  upgradePanel: SelectionState;
  listeners: SelectionState;
}

export type SelectionFeatures = keyof SelectionStateTree;

const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    glossary: cloneDeep(initialState),
    storyThreads: cloneDeep(initialState),
    upgradePanel: cloneDeep(initialState),
    listeners: cloneDeep(initialState),
  },
  reducers: {
    setSelection: (
      state,
      action: PayloadAction<{
        ids: string[];
        feature: SelectionFeatures;
      }>
    ) => {
      const { ids, feature } = action.payload;
      state[feature].selectedIds = ids;
      state[feature].lastSelectedId =
        ids.length > 0 ? ids[ids.length - 1] : null;
      state[feature].isFocused = true;
    },
    clearSelection: (
      state,
      action: PayloadAction<{ feature: SelectionFeatures }>
    ) => {
      const { feature } = action.payload;
      state[feature].selectedIds = [];
      state[feature].lastSelectedId = null;
      state[feature].isFocused = false;
    },
    toggleSelection: (
      state,
      action: PayloadAction<{
        id: string;
        feature: SelectionFeatures;
      }>
    ) => {
      const { id, feature } = action.payload;
      if (state[feature].selectedIds.includes(id)) {
        state[feature].selectedIds = state[feature].selectedIds.filter(
          (selectedId) => selectedId !== id
        );
      } else {
        state[feature].selectedIds.push(id);
      }
      state[feature].lastSelectedId = id;
      state[feature].isFocused = true;
    },
    rangeSelect: (
      state,
      action: PayloadAction<{
        startId: string;
        endId: string;
        list: string[];
        feature: SelectionFeatures;
      }>
    ) => {
      const { startId, endId, list, feature } = action.payload;
      const startIndex = list.findIndex((id) => id === startId);
      const endIndex = list.findIndex((id) => id === endId);
      if (startIndex === -1 || endIndex === -1) return;
      const range = list.slice(
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex) + 1
      );
      const ids = range.map((id) => id);
      state[feature].selectedIds = Array.from(
        new Set([...state[feature].selectedIds, ...ids])
      );
      state[feature].lastSelectedId = endId;
      state[feature].isFocused = true;
    },
  },
});

export const { setSelection, clearSelection, toggleSelection, rangeSelect } =
  selectionSlice.actions;

export default selectionSlice.reducer;

//useEffect(() => {
//   const handleClick = (e) => {
//     const glossaryPanel = document.getElementById('glossary-panel');
//     if (!glossaryPanel?.contains(e.target)) {
//       dispatch(clearSelection());
//     }
//   };

//   window.addEventListener('click', handleClick);
//   return () => window.removeEventListener('click', handleClick);
// }, []);
