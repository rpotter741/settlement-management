import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { setKeypathValue as set } from 'utility/setKeypathValue.js';

const defaultToolState = {
  static: {
    byId: {},
    allIds: [],
  },
  edit: {
    byId: {},
    allIds: [],
  },
};

const initialState = {
  attribute: cloneDeep(defaultToolState),
  category: cloneDeep(defaultToolState),
  gameStatus: cloneDeep(defaultToolState),
};

const toolSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    initializeTool: (state, action) => {
      const { tool, data } = action.payload;
      state[tool].static.byId[data.id] = data;
      state[tool].static.allIds.push(data.id);
    },
    addTool: (state, action) => {
      const { tool, data } = action.payload;
      if (!data) return;
      state[tool].static.byId[data.id] = data;
      state[tool].static.allIds.push(data.id);
    },
    initializeEdit: (state, action) => {
      const { tool, id } = action.payload;
      state[tool].edit.byId[id] = cloneDeep(state[tool].static.byId[id]);
      state[tool].edit.allIds.push(id);
    },
    saveTool: (state, action) => {
      const { tool, id, overwriteCurrent } = action.payload;
      const editClone = cloneDeep(state[tool].edit.byId[id]);
      state[tool].static.byId[id] = editClone;
      // overwriteCurrent ? (state[tool].current = editClone) : null;
    },
    updateById: (state, action) => {
      const { tool, id, keypath, updates } = action.payload;
      if (state[tool].edit.byId[id]) {
        set(state[tool].edit.byId[id], keypath, updates);
      }
    },
    deleteById: (state, action) => {
      const { tool, id } = action.payload;
      delete state[tool].static.byId[id];
      state[tool].static.allIds = state[tool].static.allIds.filter(
        (id_) => id_ !== id
      );
      if (state[tool].edit.byId[id]) {
        delete state[tool].edit.byId[id];
        state[tool].edit.allIds = state[tool].edit.allIds.filter(
          (id_) => id_ !== id
        );
      }
    },
  },
});

export const {
  initializeTool,
  addTool,
  initializeEdit,
  saveTool,
  updateById,
  deleteById,
} = toolSlice.actions;

export default toolSlice.reducer;
