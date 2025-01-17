import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../features/selection/selectionSlice';
import attributesReducer from '../features/Attributes/state/attributeSlice';
import categoriesReducer from '../features/Categories/state/categoriesSlice';
import validationReducer from '../features/validation/validationSlice';

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    validation: validationReducer,
    attributes: attributesReducer,
    categories: categoriesReducer,
  },
});

export default store;
