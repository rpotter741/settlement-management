import { configureStore } from '@reduxjs/toolkit';
import validationReducer from '../features/Validation/validationSlice';
import toolsReducer from './toolSlice';
import sidePanelReducer from '../features/SidePanel/sidePanelSlice';
import glossaryReducer from '../features/Glossary/state/glossarySlice';
import selectionReducer from '../features/Selection/state/selectionSlice';

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
