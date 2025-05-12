// toolSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, set } from 'lodash';
import {
  ToolsState,
  ToolState,
  InitializeToolPayload,
  AddToolPayload,
  InitializeEditPayload,
  SaveToolPayload,
  UpdateByIdPayload,
  DeleteByIdPayload,
} from './types';

const defaultToolState: ToolState = {
  static: {
    byId: {},
    allIds: [],
  },
  edit: {
    byId: {},
    allIds: [],
  },
};

const initialState: ToolsState = {
  attribute: cloneDeep(defaultToolState),
  category: cloneDeep(defaultToolState),
  gameStatus: cloneDeep(defaultToolState),
  key: cloneDeep(defaultToolState),
  apt: cloneDeep(defaultToolState),
  action: cloneDeep(defaultToolState),
  building: cloneDeep(defaultToolState),
  event: cloneDeep(defaultToolState),
  faction: cloneDeep(defaultToolState),
  kit: cloneDeep(defaultToolState),
  listener: cloneDeep(defaultToolState),
  settlementType: cloneDeep(defaultToolState),
  settlement: cloneDeep(defaultToolState),
  storyThread: cloneDeep(defaultToolState),
  tradeHub: cloneDeep(defaultToolState),
  upgrade: cloneDeep(defaultToolState),
};

const toolSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    initializeTool: (state, action: PayloadAction<InitializeToolPayload>) => {
      const { tool, data } = action.payload;
      state[tool].static.byId[data.id] = data;
      state[tool].static.allIds.push(data.id);
    },
    addTool: (state, action: PayloadAction<AddToolPayload>) => {
      const { tool, data } = action.payload;
      if (!data) return;
      state[tool].static.byId[data.id] = data;
      state[tool].static.allIds.push(data.id);
    },
    initializeEdit: (state, action: PayloadAction<InitializeEditPayload>) => {
      const { tool, id } = action.payload;
      if (state[tool].static.byId[id]) {
        state[tool].edit.byId[id] = cloneDeep(state[tool].static.byId[id]);
        state[tool].edit.allIds.push(id);
      }
    },
    saveTool: (state, action: PayloadAction<SaveToolPayload>) => {
      const { tool, id, overwriteCurrent } = action.payload;
      const editClone = cloneDeep(state[tool].edit.byId[id]);
      state[tool].static.byId[id] = editClone;
      if (overwriteCurrent) {
        state[tool].edit.byId[id] = editClone;
      }
    },
    updateById: (state, action: PayloadAction<UpdateByIdPayload>) => {
      const { tool, id, keypath, updates } = action.payload;
      if (state[tool].edit.byId[id]) {
        set(state[tool].edit.byId[id], keypath, updates);
      }
    },
    deleteById: (state, action: PayloadAction<DeleteByIdPayload>) => {
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
