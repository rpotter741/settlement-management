import { SnackbarState, SnackbarType } from '../types/SnackbarTypes.js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'lodash';

export const initialState: SnackbarState = {
  open: false,
  currentSnackbar: null,
  queue: [],
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{
        message: string;
        type?: SnackbarType;
        duration?: number;
        component?: React.ComponentType<any>;
        props?: Record<string, any>;
      }>
    ) => {
      const {
        message,
        type = 'info',
        duration = 3000,
        component,
        props,
      } = action.payload;
      if (state.queue[0]?.message === message) return;
      state.queue.push({ message, type, duration, component, props });
      if (!state.open) {
        state.open = true;
        state.currentSnackbar = state.queue.shift() || null;
      }
    },
    closeSnackbar: (state) => {
      state.open = false;
      state.currentSnackbar = null;
    },
    processQueue: (state) => {
      if (state.queue.length > 0) {
        if (state.open !== true) {
          state.open = true;
        }
        state.currentSnackbar = state.queue.shift() || null;
      } else {
        state.open = false;
        state.currentSnackbar = null;
      }
    },
  },
});

export const { showSnackbar, closeSnackbar, processQueue } =
  snackbarSlice.actions;
export default snackbarSlice.reducer;
