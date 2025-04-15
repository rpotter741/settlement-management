import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';

// Base Selectors
const base = (state) => state.tools;

export const selectCurrentTool = (tool) =>
  createSelector([base], (state) => state[tool].current);

export const selectEditTool = (tool) =>
  createSelector([base], (state) => state[tool].edit);

export const selectAllToolIds = (tool) =>
  createSelector([base], (state) => state[tool].allIds);

export const selectToolById = (tool, id) =>
  createSelector([base], (tools) => tools[tool].byId[id]);

export const selectAllTools = (tool) =>
  createSelector([base], (state) =>
    state[tool].allIds.map((id) => state[tool].byId[id])
  );

//factory, baby!
export const selectToolValue = (tool, keypath) =>
  createSelector([selectEditTool(tool)], (editTool) => get(editTool, keypath));

//validation
const validationBase = (state) => state.validation;
export const selectToolErrors = (tool) =>
  createSelector([validationBase], (validation) => validation[tool]);

export const toolSelectors = {
  current: selectCurrentTool,
  edit: selectEditTool,
  allIds: selectAllToolIds,
  byId: selectToolById,
  allTools: selectAllTools,
  selectValue: selectToolValue,
  errors: selectToolErrors,
};
