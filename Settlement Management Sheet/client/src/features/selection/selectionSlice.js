import { createSlice } from '@reduxjs/toolkit';

const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    category: null,
    attribute: null,
    event: null,
    phase: null,
    weather: null,
    status: null,
    building: null,
    upgrade: null,
    tradeHub: null,
    settlementType: null,
    settlement: null,
    listener: null,
    apt: null,
  },
  reducers: {
    selectKey(state, action) {
      const { key, value } = action.payload;
      if (key in state) {
        state[key] = value;
      } else {
        console.error(`Invalid key: ${key}`);
      }
    },
    clearKey(state, action) {
      const { key } = action.payload;
      if (key in state) {
        state[key] = null;
      } else {
        console.error(`Invalid key: ${key}`);
      }
    },
  },
});

export const { selectKey, clearKey } = selectionSlice.actions;

export const getSelectedId = (key) => (state) => state.selection[key];

export default selectionSlice.reducer;
