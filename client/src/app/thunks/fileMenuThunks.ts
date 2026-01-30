import { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';

import glossaryServerAction from '../../services/glossaryServices.js';
import toolServerActions from '../../services/toolServices.js';
import * as glossarySlice from '../slice/glossarySlice.js';
import * as toolSlice from '../slice/toolSlice.js';
import * as tabSlice from '../slice/tabSlice.js';
import { AppDispatch, RootState } from '../store.js';
import structure, { getTabInfo } from '@/features/SidePanel/structure.js';
import { ToolName } from '../types/ToolTypes.js';
import { Tab } from '../types/TabTypes.js';
import { showSnackbar } from '../slice/snackbarSlice.js';
import { cloneDeep, isEqual } from 'lodash';

const editStringTrimFields: Partial<Record<ToolName, string[]>> = {
  attribute: ['name', 'description'],
  category: ['name', 'description'],
};

export const createNewToolFile = (
  toolString: string,
  side: 'left' | 'right'
) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { name, id, tool, tabId, scroll, preventSplit } =
      getTabInfo(toolString);
    dispatch(
      tabSlice.addTab({
        name,
        id,
        mode: 'edit',
        tool,
        tabId,
        scroll,
        activate: true,
        preventSplit,
        side,
      })
    );
  };
};

export const saveToolFile = (tab: Tab) => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    const { tool, id, viewState } = tab;
    if (!tool || !id) return;
    const state = getState();
    const edit = state.tools[tool]?.edit.byId[id];
    const current = state.tools[tool]?.static.byId[id];
    if (isEqual(edit, current)) {
      dispatch(
        showSnackbar({
          message: `${tab.name} saved successfully!`,
          type: 'success',
        })
      );
      return;
    }
    if (!edit) return;
    try {
      const editFields = editStringTrimFields[tool as ToolName] || [];
      const trimmedEdit = cloneDeep(edit);
      editFields.forEach((field) => {
        if (trimmedEdit[field]) {
          trimmedEdit[field] = trimmedEdit[field].trim();
        }
      });
      await toolServerActions.saveTool({
        tool: tool as ToolName,
        data: { ...trimmedEdit },
      });
      dispatch(
        toolSlice.saveTool({
          tool: tool as ToolName,
          id: tab.id,
        })
      );
      if (viewState.isDirty) {
        dispatch(
          tabSlice.updateTab({
            tabId: tab.tabId,
            side: tab.side,
            keypath: 'viewState.isDirty',
            updates: false,
          })
        );
      }
      dispatch(
        tabSlice.updateTab({
          tabId: tab.tabId,
          side: tab.side,
          keypath: 'mode',
          updates: 'preview',
        })
      );
      dispatch(
        showSnackbar({
          message: `${tab.name} saved successfully!`,
          type: 'success',
        })
      );
    } catch (error: any) {
      console.error('Error saving tool file:', error);
      dispatch(
        showSnackbar({
          message: `Error saving ${tool} file: ${error.message}`,
          type: 'error',
        })
      );
    }
  };
};
