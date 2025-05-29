import { configureStore } from '@reduxjs/toolkit';
import validationReducer from '../features/Validation/validationSlice.js';
import toolsReducer from './toolSlice.js';
import sidePanelReducer from '../features/SidePanel/sidePanelSlice.js';
import glossaryReducer from '../features/Glossary/state/glossarySlice.js';
import selectionReducer from '../features/Selection/state/selectionSlice.js';

export const store = configureStore({
  reducer: {
    validation: validationReducer,
    tools: toolsReducer,
    sidePanel: sidePanelReducer,
    glossary: glossaryReducer,
    selection: selectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
