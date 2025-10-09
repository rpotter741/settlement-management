import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RelayEntry {
  data: any;
  timestamp: number;
  status: 'pending' | 'complete' | 'error';
  errorMessage?: string;
  ttl: number;
}

interface RelayState {
  relays: Record<string, RelayEntry>;
}

export const initialState: RelayState = {
  relays: {},
};

const relaySlice = createSlice({
  name: 'relay',
  initialState,
  reducers: {
    initializeRelay: (
      state,
      action: PayloadAction<{
        id: string;
        data?: any;
        status?: 'pending' | 'complete' | 'error';
        ttl?: number;
      }>
    ) => {
      const { id, data, status, ttl } = action.payload;
      state.relays[id] = {
        data: data ?? null,
        timestamp: Date.now(),
        status: status ?? 'pending',
        ttl: ttl ?? 10000,
      };
    },
    updateRelay: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const { id, data } = action.payload;
      if (state.relays[id]) {
        state.relays[id].data = data;
        state.relays[id].status = 'complete';
      }
    },
    clearRelay: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.relays[id]) {
        delete state.relays[id];
      }
    },
    addErrorMessage: (
      state,
      action: PayloadAction<{ id: string; errorMessage: string }>
    ) => {
      const { id, errorMessage } = action.payload;
      if (state.relays[id]) {
        state.relays[id].status = 'error';
        state.relays[id].errorMessage = errorMessage;
      }
    },
    refreshRelay: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.relays[id]) {
        state.relays[id].timestamp = Date.now();
      }
    },
  },
});

export const {
  initializeRelay,
  updateRelay,
  clearRelay,
  addErrorMessage,
  refreshRelay,
} = relaySlice.actions;

export default relaySlice.reducer;
