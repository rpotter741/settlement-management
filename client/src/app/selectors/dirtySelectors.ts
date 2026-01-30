import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { DirtyScopes, DirtyState } from '../slice/dirtySlice.js';

const base = (state: RootState) => state.dirty;

const selectDirtyKeypathsByDomain = (nation: DirtyScopes, id: string) =>
  createSelector(base, (dirtyState: DirtyState) => {
    return dirtyState[nation]?.[id]?.dirtyKeypaths || {};
  });

export { selectDirtyKeypathsByDomain };
