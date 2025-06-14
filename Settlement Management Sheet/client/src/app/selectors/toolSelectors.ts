import { createSelector } from '@reduxjs/toolkit';

import { isEqual, get } from 'lodash';
import { RootState } from '../store.js';
import { ToolsState, ToolName, ToolData } from '../types/ToolTypes.js';

// Base Selectors
const base = (state: RootState): ToolsState => state.tools;
const validationBase = (state: RootState) => state.validation;

// Selectors

export const selectToolById = (tool: ToolName, id: string) =>
  createSelector([base], (state) => state[tool].static.byId[id]);

export const selectEditToolById = (tool: ToolName, id: string) =>
  createSelector([base], (state) => state[tool].edit.byId[id]);

export const selectAllToolIds = (tool: ToolName) =>
  createSelector([base], (state) => state[tool].static.allIds);

export const selectAllEditToolIds = (tool: ToolName) =>
  createSelector([base], (state) => state[tool].edit.allIds);

export const selectAllTools = (tool: ToolName) =>
  createSelector([base], (state) =>
    state[tool].static.allIds.map((id) => state[tool].static.byId[id])
  );

export const selectAllEditTools = (tool: ToolName) =>
  createSelector([base], (state) =>
    state[tool].edit.allIds.map((id) => state[tool].edit.byId[id])
  );

// Factories
export const selectToolValue = (tool: ToolName, id: string, keypath: string) =>
  createSelector([selectToolById(tool, id)], (toolData) =>
    get(toolData, keypath, null)
  );

export const selectEditToolValue = (
  tool: ToolName,
  id: string,
  keypath: string
) =>
  createSelector([selectEditToolById(tool, id)], (editTool) =>
    get(editTool, keypath, null)
  );

// Dirty state detection
export const isToolDirty = (tool: ToolName, id: string) =>
  createSelector(
    [selectToolById(tool, id), selectEditToolById(tool, id)],
    (tool, editTool) => {
      if (!tool || !editTool) return false;
      return !isEqual(tool, editTool);
    }
  );

// Validation
export const selectToolErrors = (tool: ToolName, id: string) =>
  createSelector([validationBase], (validation) => validation[tool].byId[id]);

export const selectKeypathErrors = (
  tool: ToolName,
  id: string,
  keypath: string
) =>
  createSelector(
    [selectToolErrors(tool, id)],
    (errors) => get(errors, keypath) || null
  );

// Combined Selectors
export const toolSelectors = {
  byId: selectToolById,
  allIds: selectAllToolIds,
  byEditId: selectEditToolById,
  allEditIds: selectAllEditToolIds,
  allTools: selectAllTools,
  allEditTools: selectAllEditTools,
  selectValue: selectToolValue,
  selectEditValue: selectEditToolValue,
  errors: selectToolErrors,
  keypathError: selectKeypathErrors,
  changes: isToolDirty,
};
