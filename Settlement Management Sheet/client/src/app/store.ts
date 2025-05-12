import { configureStore } from '@reduxjs/toolkit';
import validationReducer from '../features/Validation/validationSlice';
import toolsReducer from './toolSlice';
import sidePanelReducer from '../features/SidePanel/sidePanelSlice';

export const store = configureStore({
  reducer: {
    validation: validationReducer,
    tools: toolsReducer,
    sidePanel: sidePanelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
