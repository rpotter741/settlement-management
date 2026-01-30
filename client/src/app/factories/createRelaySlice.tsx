import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RelayEntry<T> {
  data: T | null;
  status: 'pending' | 'complete' | 'consumed' | 'error';
  errorMessage?: string;
  timestamp: number;
}

export const createRelaySlice = <T = any,>(name: string) => {
  const slice = createSlice({
    name,
    initialState: {
      relays: {} as Record<string, RelayEntry<T>>,
    },
    reducers: {
      initializeRelay: (
        state,
        action: PayloadAction<{
          id: string;
          data?: any;
          status?: 'pending' | 'complete' | 'error';
        }>
      ) => {
        const { id, data, status } = action.payload;
        state.relays[id] = {
          data: data ?? null,
          timestamp: Date.now(),
          status: status ?? 'pending',
        };
      },
      updateRelay: (
        state,
        action: PayloadAction<{ id: string; data: any }>
      ) => {
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
    },
  });

  return {
    reducer: slice.reducer,
    actions: slice.actions,
    name,
  };
};
