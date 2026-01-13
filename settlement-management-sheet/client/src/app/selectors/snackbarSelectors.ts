import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.js';

const base = (state: RootState) => state.snackbar;

export const currentSnackbar = createSelector(
  [base],
  (state) => state.currentSnackbar
);
export const isOpen = createSelector([base], (state) => state.open);
export const queue = createSelector([base], (state) => state.queue);
export const hasQueue = createSelector([queue], (queue) => queue.length > 0);
