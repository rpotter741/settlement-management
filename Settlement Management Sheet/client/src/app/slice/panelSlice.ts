import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  panelOpen: true,
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
    setBreadcrumbs(state, action) {
      state.breadcrumbs = action.payload.breadcrumbs;
    },
    setToolOptions(state, action) {
      state.toolOptions = action.payload.options;
    },
  },
});

export const { togglePanel, setBreadcrumbs, setToolOptions } =
  panelSlice.actions;

export default panelSlice.reducer;
