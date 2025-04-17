import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { setKeypathValue as set } from 'utility/setKeypathValue.js';

const defaultToolState = {
  current: null,
  edit: null,
  byId: {},
  allIds: [],
};

const initialState = {
  attribute: cloneDeep(defaultToolState),
  category: cloneDeep(defaultToolState),
};

const toolSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    initializeTool: (state, action) => {
      const { tool, data } = action.payload;
      state[tool].byId[data.id] = data;
      state[tool].allIds.push(data.id);
    },
    addTool: (state, action) => {
      const { tool, data } = action.payload;
      state[tool].byId[data.id] = data;
      state[tool].allIds.push(data.id);
    },
    initializeEdit: (state, action) => {
      const { tool, id } = action.payload;
      state[tool].edit = cloneDeep(state[tool].byId[id]);
    },
    saveTool: (state, action) => {
      const { tool, id, overwriteCurrent } = action.payload;
      const editClone = cloneDeep(state[tool].edit);
      state[tool].byId[id] = editClone;
      overwriteCurrent ? (state[tool].current = editClone) : null;
    },
    updateById: (state, action) => {
      const { tool, id, keypath, updates } = action.payload;
      if (state[tool].byId[id]) {
        set(state[tool].byId[id], keypath, updates);
      }
    },
    updateEdit: (state, action) => {
      const { tool, keypath, updates } = action.payload;
      set(state[tool].edit, keypath, updates);
    },
    deleteById: (state, action) => {
      const { tool, id } = action.payload;
      delete state[tool].byId[id];
      state[tool].allIds = state[tool].allIds.filter((id_) => id_ !== id);
    },
    refreshById: (state, action) => {
      const { tool, id } = action.payload;
      state[tool].byId[id] = { ...state[tool].byId[id] };
    },
    setCurrent: (state, action) => {
      const { tool, data, initializeEdit } = action.payload;
      state[tool].current = cloneDeep(data);
      if (initializeEdit) {
        state[tool].edit = cloneDeep(data);
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
  updateEdit,
  deleteById,
  refreshById,
  setCurrent,
} = toolSlice.actions;

export default toolSlice.reducer;
