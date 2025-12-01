// toolSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, get, set } from 'lodash';
import {
  ToolsState,
  ToolState,
  InitializeToolPayload,
  AddToolPayload,
  InitializeEditPayload,
  SaveToolPayload,
  UpdateByIdPayload,
  DeleteByIdPayload,
} from '../types/ToolTypes.js';

const defaultToolState: ToolState = {
  static: {
    byId: {},
    allIds: [],
  },
  edit: {
    byId: {},
    allIds: [],
  },
  isDirty: {},
};

export interface ToolStateTree {
  attribute: ToolState;
  category: ToolState;
  gameStatus: ToolState;
  apt: ToolState;
  action: ToolState;
  building: ToolState;
  event: ToolState;
  collective: ToolState;
  kit: ToolState;
  listener: ToolState;
  settlementType: ToolState;
  settlement: ToolState;
  storyThread: ToolState;
  tradeHub: ToolState;
  upgrade: ToolState;
}

const initialState: ToolsState = {
  attribute: cloneDeep(defaultToolState),
  category: cloneDeep(defaultToolState),
  gameStatus: cloneDeep(defaultToolState),
  apt: cloneDeep(defaultToolState),
  action: cloneDeep(defaultToolState),
  building: cloneDeep(defaultToolState),
  event: cloneDeep(defaultToolState),
  collective: cloneDeep(defaultToolState),
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
      if (state[tool].isDirty[id]) {
        state[tool].isDirty[id] = {};
      }
      if (overwriteCurrent) {
        state[tool].edit.byId[id] = editClone;
      }
    },
    revertToStatic: (
      state,
      action: PayloadAction<{ tool: string; id: string }>
    ) => {
      const { tool, id } = action.payload;
      if (state[tool].static.byId[id]) {
        state[tool].edit.byId[id] = cloneDeep(state[tool].static.byId[id]);
        if (state[tool].isDirty[id]) {
          state[tool].isDirty[id] = {};
        }
      } else {
        console.warn(
          `Attempted to revert to static for non-existent tool with id ${id} for tool ${tool}`
        );
      }
    },
    updateById: (state, action: PayloadAction<UpdateByIdPayload>) => {
      const { tool, id, keypath, updates } = action.payload;
      if (state[tool].edit.byId[id]) {
        set(state[tool].edit.byId[id], keypath, updates);
        if (!state[tool].isDirty[id]) {
          state[tool].isDirty[id] = {};
        }
        if (get(state[tool].static.byId[id], keypath) !== updates) {
          set(state[tool].isDirty[id], keypath, true);
        } else {
          set(state[tool].isDirty[id], keypath, false);
        }
      } else {
        console.warn(
          `Attempted to update non-existent edit tool with id ${id} for tool ${tool}`
        );
      }
    },
    batchUpdateById: (state, action: PayloadAction<any>) => {
      const { tool, id, updates } = action.payload;
      console.log(updates, 'batch updates for', tool, id);
      if (state[tool].edit.byId[id]) {
        const staticTool = state[tool].static.byId[id];
        const editTool = state[tool].edit.byId[id];
        for (const [keypath, value] of Object.entries(updates)) {
          console.log(`setting ${keypath} to`, value);
          set(staticTool, keypath, value);
          set(editTool, keypath, value);
          set(state[tool].isDirty[id], keypath, false);
        }
      } else {
        console.warn(
          `Attempted to update non-existent edit tool with id ${id} for tool ${tool}`
        );
      }
    },
    deleteById: (state, action: PayloadAction<DeleteByIdPayload>) => {
      const { tool, id } = action.payload;
      delete state[tool].static.byId[id];
      state[tool].static.allIds = state[tool].static.allIds.filter(
        (id_: string) => id_ !== id
      );
      if (state[tool].edit.byId[id]) {
        delete state[tool].edit.byId[id];
        state[tool].edit.allIds = state[tool].edit.allIds.filter(
          (id_: string) => id_ !== id
        );
      }
      if (!state[tool].isDirty[id]) {
        delete state[tool].isDirty[id];
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
  batchUpdateById,
  deleteById,
  revertToStatic,
} = toolSlice.actions;

export default toolSlice.reducer;
