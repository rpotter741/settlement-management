import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.js';

const base = (state: RootState) => state.modal;

export const currentModal = createSelector(
  [base],
  (state) => state.currentModal
);
export const currentModalKey = createSelector(
  [base],
  (state) => state.currentModalKey
);
export const isModalOpen = createSelector([base], (state) => state.open);
export const currentModalId = createSelector(
  [base],
  (state) => state.currentModalId
);
export const modalProps = createSelector([base], (state) => state.props);
export const modalPositionSx = createSelector(
  [base],
  (state) => state.positionSx
);
export const modalQueue = createSelector([base], (state) => state.queue);
export const disableBackgroundClose = createSelector(
  [base],
  (state) => state.disableBackgroundClose
);
export const nextCloseFn = createSelector([base], (state) => state.nextCloseFn);
