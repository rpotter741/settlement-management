import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../features/selection/selectionSlice';
import attributesReducer from '../features/attribute/attributeSlice';
import categoriesReducer from '../features/category/categoriesSlice';

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    attributes: attributesReducer,
    categories: categoriesReducer,
  },
});

export default store;
