import { createSlice } from '@reduxjs/toolkit';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    byId: {},
    allIds: [],
  },
  reducers: {
    initializeCategory(state) {
      const tempId = `temp-${Date.now()}`; // Temporary unique ID for the category
      state.byId[tempId] = {
        id: tempId,
        name: '',
        description: '',
        attributes: [],
        thresholds: [],
        dependencies: [],
      };
      state.allIds.push(tempId);
      return state.byId[tempId];
    },
    addCategory(state, action) {
      const { id, name, description, thresholds } = action.payload;
      state.byId[id] = {
        id,
        name,
        description,
        thresholds,
        attributes: [],
      };
      state.allIds.push(id);
    },
    updateCategory(state, action) {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },
    deleteCategory(state, action) {
      const { id } = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((categoryId) => categoryId !== id);
    },
    addAttribute(state, action) {
      const { categoryId, attribute } = action.payload;
      if (state.byId[categoryId]) {
        state.byId[categoryId].attributes.push(attribute);
      }
    },
    updateAttribute(state, action) {
      const { categoryId, attributeId, updates } = action.payload;
      const category = state.byId[categoryId];
      if (category) {
        const attribute = category.attributes.find(
          (attr) => attr.id === attributeId
        );
        if (attribute) {
          Object.assign(attribute, updates);
        }
      }
    },
    deleteAttribute(state, action) {
      const { categoryId, attributeId } = action.payload;
      const category = state.byId[categoryId];
      if (category) {
        category.attributes = category.attributes.filter(
          (attr) => attr.id !== attributeId
        );
      }
    },
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  addAttribute,
  updateAttribute,
  deleteAttribute,
} = categoriesSlice.actions;

export const selectCategoryById = (state, id) => state.categories.byId[id];
export const selectAllCategories = (state) =>
  state.categories.allIds.map((id) => state.categories.byId[id]);

export default categoriesSlice.reducer;
