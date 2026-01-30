import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.js';

const base = (state: RootState) => state.relay;

export const selectRelayById = (id: string) =>
  createSelector([base], (relay) => relay.relays[id]);

export const selectAllRelays = createSelector([base], (relay) => relay.relays);
