import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  panelOpen: true,
  width: 300,
  breadcrumbs: [],
  toolOptions: {},
};

const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    togglePanel(state) {
      state.panelOpen = !state.panelOpen;
    },
    setWidth(state, action) {
      state.width = action.payload.width;
    },
    setBreadcrumbs(state, action) {
      state.breadcrumbs = action.payload.breadcrumbs;
    },
    setToolOptions(state, action) {
      state.toolOptions = action.payload.options;
    },
  },
});

export const { togglePanel, setWidth, setBreadcrumbs, setToolOptions } =
  panelSlice.actions;

export default panelSlice.reducer;
