import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ClipboardType = 'subType-property' | 'subType-group' | 'subType';

interface ClipboardEntry {
  type: ClipboardType;
  data: any;
}

interface ClipboardState {
  clipboard: ClipboardEntry | null;
}

export const initialState: ClipboardState = {
  clipboard: null,
};

const clipboardSlice = createSlice({
  name: 'clipboard',
  initialState,
  reducers: {
    setClipboard: (
      state,
      action: PayloadAction<{
        type: ClipboardType;
        data: any;
      }>
    ) => {
      const { type, data } = action.payload;
      state.clipboard = {
        type,
        data,
      };
    },
    clearClipboard: (state) => {
      state.clipboard = null;
    },
  },
});

export const { setClipboard, clearClipboard } = clipboardSlice.actions;

export default clipboardSlice.reducer;
