import { configureStore } from '@reduxjs/toolkit';
import validationReducer from './slice/validationSlice.js';
import toolsReducer from './slice/toolSlice.js';
import sidePanelReducer from './slice/sidePanelSlice.js';
import glossaryReducer from './slice/glossarySlice.js';
import selectionReducer from './slice/selectionSlice.js';
import snackbarReducer from './slice/snackbarSlice.js';
import modalReducer from './slice/modalSlice.js';

export const store = configureStore({
  reducer: {
    validation: validationReducer,
    tools: toolsReducer,
    sidePanel: sidePanelReducer,
    glossary: glossaryReducer,
    selection: selectionReducer,
    snackbar: snackbarReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
