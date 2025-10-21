import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RelayEntry {
  data: any;
  timestamp: number;
  status: 'pending' | 'complete' | 'error';
  errorMessage?: string;
  ttl: number;
  sourceId?: string; // Optional field for tracking source of relay
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
        sourceId?: string; // Optional field for tracking source of relay
      }>
    ) => {
      const { id, data, status, ttl, sourceId } = action.payload;
      state.relays[id] = {
        data: data ?? null,
        timestamp: Date.now(),
        status: status ?? 'pending',
        ttl: ttl ?? 10000,
        sourceId: sourceId ?? undefined,
      };
    },
    updateRelay: (
      state,
      action: PayloadAction<{ id: string; data: any; sourceId?: string }>
    ) => {
      const { id, data, sourceId } = action.payload;
      if (state.relays[id]) {
        if (state.relays[id].data) {
          // Merge existing data with new data
          state.relays[id].data = {
            ...state.relays[id].data,
            ...data,
          };
          state.relays[id].status = 'complete';
          state.relays[id].sourceId = sourceId ?? undefined;
          return;
        } else {
          state.relays[id].data = data;
          state.relays[id].status = 'complete';
          state.relays[id].sourceId = sourceId ?? undefined;
        }
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
      action: PayloadAction<{
        id: string;
        errorMessage: string;
        sourceId?: string;
      }>
    ) => {
      const { id, errorMessage, sourceId } = action.payload;
      if (state.relays[id]) {
        state.relays[id].status = 'error';
        state.relays[id].errorMessage = errorMessage;
        state.relays[id].sourceId = sourceId ?? undefined;
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
