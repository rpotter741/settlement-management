import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../features/selection/selectionSlice';
import validationReducer from '../features/validation/validationSlice';
import toolsReducer from './toolSlice';
import sidePanelReducer from 'features/sidePanel/sidePanelSlice';

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    validation: validationReducer,
    tools: toolsReducer,
    sidePanel: sidePanelReducer,
  },
});

export default store;
