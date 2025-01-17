import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { setKeypathValue as set } from 'utility/setKeypathValue.js';
import createNewCategory from 'category/helpers/initializeCategory.js';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    byId: {},
    allIds: [],
    edit: {},
  },
  reducers: {
    initializeCategory(state) {
      const tempId = `temp-${Date.now()}`;
      const newCategory = createNewCategory(tempId); // Temporary unique ID for the category
      state.byId[tempId] = newCategory;
      state.allIds.push(tempId);
    },
    addCategory(state, action) {
      const { category } = action.payload;
      const id = category.id;
      state.byId[id] = category;
      state.allIds.push(id);
    },
    initializeEdit(state, action) {
      const { id } = action.payload;
      state.edit = cloneDeep(state.byId[id]);
    },
    saveCategory(state, action) {
      const { id } = action.payload;
      const editClone = cloneDeep(state.edit);
      state.byId[id] = editClone;
    },
    updateById(state, action) {
      const { id, keypath, updates } = action.payload;
      if (state.byId[id]) {
        set(state.byId[id], keypath, updates);
      }
    },
    updateEdit(state, action) {
      const { keypath, updates } = action.payload;
      set(state.edit, keypath, updates);
    },
    deleteById(state, action) {
      const { id } = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((categoryId) => categoryId !== id);
    },
    refreshById(state, action) {
      const { id } = action.payload;
      state.byId[id] = { ...state.byId[id] };
    },
  },
});

export const {
  initializeCategory,
  addCategory,
  initializeEdit,
  saveCategory,
  updateById,
  updateEdit,
  deleteById,
  refreshById,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
