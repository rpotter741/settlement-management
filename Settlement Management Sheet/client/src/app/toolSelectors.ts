import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { RootState } from './store';
import { ToolsState, ToolName, ToolData } from './types';

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
    get(toolData, keypath)
  );

export const selectEditToolValue = (
  tool: ToolName,
  id: string,
  keypath: string
) =>
  createSelector([selectEditToolById(tool, id)], (editTool) =>
    get(editTool, keypath)
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
  changes: isToolDirty,
};
