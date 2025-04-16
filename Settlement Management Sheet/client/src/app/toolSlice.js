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
      state[tool].byId[data.refId] = data;
      state[tool].allIds.push(data.refId);
    },
    addTool: (state, action) => {
      const { tool, data } = action.payload;
      state[tool].byId[data.refId] = data;
      state[tool].allIds.push(data.refId);
    },
    initializeEdit: (state, action) => {
      const { tool, refId } = action.payload;
      state[tool].edit = cloneDeep(state[tool].byId[refId]);
    },
    saveTool: (state, action) => {
      const { tool, refId, overwriteCurrent } = action.payload;
      const editClone = cloneDeep(state[tool].edit);
      state[tool].byId[refId] = editClone;
      overwriteCurrent ? (state[tool].current = editClone) : null;
    },
    updateById: (state, action) => {
      const { tool, refId, keypath, updates } = action.payload;
      if (state[tool].byId[refId]) {
        set(state[tool].byId[refId], keypath, updates);
      }
    },
    updateEdit: (state, action) => {
      const { tool, keypath, updates } = action.payload;
      set(state[tool].edit, keypath, updates);
    },
    deleteById: (state, action) => {
      const { tool, refId } = action.payload;
      delete state[tool].byId[refId];
      state[tool].allIds = state[tool].allIds.filter((id) => id !== refId);
    },
    refreshById: (state, action) => {
      const { tool, refId } = action.payload;
      state[tool].byId[refId] = { ...state[tool].byId[refId] };
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
