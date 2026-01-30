import { configureStore } from '@reduxjs/toolkit';
import validationReducer from './slice/validationSlice.js';
import toolsReducer from './slice/toolSlice.js';
import tabReducer from './slice/tabSlice.js';
import glossaryReducer from './slice/glossarySlice.js';
import selectionReducer from './slice/selectionSlice.js';
import snackbarReducer from './slice/snackbarSlice.js';
import modalReducer from './slice/modalSlice.js';
import panelReducer from './slice/panelSlice.js';
import uiReducer from './slice/uiSlice.js';
import dirtyReducer from './slice/dirtySlice.js';
import relayReducer from './slice/relaySlice.js';
import subTypeReducer from './slice/subTypeSlice.js';
import clipboardReducer from './slice/clipboardSlice.js';
import userReducer from './slice/userSlice.js';
import { relayTimerMiddleware } from './middleware/relayTTLMiddleware.js';

export const store = configureStore({
  reducer: {
    validation: validationReducer,
    tools: toolsReducer,
    tabs: tabReducer,
    glossary: glossaryReducer,
    selection: selectionReducer,
    snackbar: snackbarReducer,
    clipboard: clipboardReducer,
    modal: modalReducer,
    panel: panelReducer,
    ui: uiReducer,
    dirty: dirtyReducer,
    relay: relayReducer,
    subType: subTypeReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([relayTimerMiddleware()]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
