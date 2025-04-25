import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

// Base Selectors
const base = (state) => state.tools;

export const selectCurrentTool = (tool) =>
  createSelector([base], (state) => state[tool].current);

export const selectToolById = (tool, id) =>
  createSelector([base], (state) => state[tool].static.byId[id]);

export const selectEditToolById = (tool, id) =>
  createSelector([base], (state) => state[tool].edit.byId[id]);

export const selectAllToolIds = (tool) =>
  createSelector([base], (state) => state[tool].static.allIds);

export const selectAllEditToolIds = (tool) =>
  createSelector([base], (state) => state[tool].edit.allIds);

export const selectAllTools = (tool) =>
  createSelector([base], (state) =>
    state[tool].static.allIds.map((id) => state[tool].static.byId[id])
  );

export const selectAllEditTools = (tool) =>
  createSelector([base], (state) =>
    state[tool].edit.allIds.map((id) => state[tool].edit.byId[id])
  );

//factories, baby!
export const selectToolValue = (tool, id, keypath) =>
  createSelector([selectToolById(tool, id)], (tool) => get(tool, keypath));

export const selectEditToolValue = (tool, id, keypath) =>
  createSelector([selectEditToolById(tool, id)], (editTool) =>
    get(editTool, keypath)
  );

// dirty state detection
export const isToolDirty = (tool, id) =>
  createSelector(
    [selectToolById(tool, id), selectEditToolById(tool, id)],
    (tool, editTool) => {
      if (!tool || !editTool) return false;
      return !isEqual(tool, editTool);
    }
  );

//validation
const validationBase = (state) => state.validation;
export const selectToolErrors = (tool) =>
  createSelector([validationBase], (validation) => validation[tool]);

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
