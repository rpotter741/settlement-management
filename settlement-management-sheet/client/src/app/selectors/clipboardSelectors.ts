import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.js';

const base = (state: RootState) => state.clipboard;

const selectClipboard = createSelector(
  base,
  (clipboardState) => clipboardState.clipboard
);

export { selectClipboard };
