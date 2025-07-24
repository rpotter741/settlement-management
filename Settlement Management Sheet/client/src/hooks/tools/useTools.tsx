import { ToolName, Tool } from 'types/index.js';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { validateField, validateTool } from '@/app/slice/validationSlice.js';
import api from '@/services/interceptor.js';
import { saveTool } from '@/app/slice/toolSlice.js';
import { toolSelectors as select } from '@/app/selectors/toolSelectors.js';
import { loadTool, updateDirtyTool } from '@/app/thunks/toolThunks.js';
import { AppDispatch } from '@/app/store.js';

export const useToolActions = (tool: ToolName, id: string) => {
  const dispatch: AppDispatch = useDispatch();

  const updateTool = useCallback(
    (keypath: string, updates: any) => {
      dispatch(updateDirtyTool({ id, tool, keypath, updates }));
    },
    [dispatch]
  );

  const validateToolField = useCallback(
    (keypath: string, error: string | null) => {
      dispatch(validateField({ id, tool, keypath, error }));
    },
    [dispatch]
  );

  const validateAll = useCallback(
    (refObj: Tool) => {
      dispatch(
        validateTool({
          tool,
          id,
          fields: Object.keys(refObj),
          refObj,
        })
      );
    },
    [dispatch]
  );

  const saveToolEdit = useCallback(
    (overwriteCurrent = false) => {
      dispatch(saveTool({ tool, id, overwriteCurrent }));
    },
    [dispatch]
  );

  const loadNewTool = useCallback(
    ({
      refId,
      id,
      currentTool,
    }: {
      refId: string;
      id: string;
      currentTool: ToolName;
    }) => {
      dispatch(loadTool({ tool, refId, id, currentTool }));
    },
    [dispatch]
  );

  return {
    updateTool,
    validateToolField,
    validateAll,
    saveToolEdit,
    loadNewTool,
  };
};

export const useToolSelectors = (tool: ToolName, id: string) => {
  const current = useSelector(select.byId(tool, id));
  const edit = useSelector(select.byEditId(tool, id));
  const allIds = useSelector(select.allIds(tool));
  const allEditIds = useSelector(select.allEditIds(tool));
  const allTools = useSelector(select.allTools(tool));
  const allEditTools = useSelector(select.allEditTools(tool));
  const errors = useSelector(select.errors(tool, id));
  const dirty = useSelector(select.changes(tool, id));

  const selectStaticValue = (keypath: string) =>
    useSelector(select.selectValue(tool, id, keypath));

  const selectEditValue = (keypath: string) =>
    useSelector(select.selectEditValue(tool, id, keypath));

  const selectErrorValue = (keypath: string) =>
    useSelector(select.keypathError(tool, id, keypath));

  return {
    current,
    edit,
    allIds,
    allEditIds,
    allTools,
    allEditTools,
    errors,
    selectStaticValue,
    selectEditValue,
    dirty,
    selectErrorValue,
  };
};

export const useServer = (tool: ToolName) => {
  const actions = {
    save: async (data: Tool) => {
      try {
        return await api.post(`/tools/${tool}/save`, {
          data: {
            ...data,
            contentType: 'OFFICIAL',
            createdBy: 'Admin',
          },
          tool,
        });
      } catch (error: any) {
        console.error('API error:', error.message);
        throw new Error(error.response?.data?.message || `Failed to save data`);
      }
    },
    publish: async (data: Tool) => {
      const { refId, id } = data;
      try {
        return await api.post(`/tools/${tool}/publish`, {
          data: { refId, id },
          tool,
        });
      } catch (error: any) {
        console.error('API error:', error.message);
        throw new Error(
          error.response?.data?.message || `Failed to publish data`
        );
      }
    },
    delete: async (data: Tool) => {
      const { refId } = data;
      try {
        return await api.post('/tools/${tool}/delete', { refId, tool });
      } catch (error: any) {
        console.error('API error:', error.message);
        throw new Error(
          error.response?.data?.message || `Failed to delete data`
        );
      }
    },
  };

  const runServerActions = async (
    action: string,
    data: Tool,
    debug = false
  ) => {
    try {
      if (!actions[action as keyof typeof actions]) {
        throw new Error(`Unknown server action: ${action}`);
      }

      const response = await actions[action as keyof typeof actions](data);
      if (debug) console.log('Server response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API error:', error.message);
      throw new Error(
        error.response?.data?.message || `Failed to ${action} data`
      );
    }
  };

  return {
    runServerActions,
  };
};

export const useTools = (tool: ToolName, id: string) => {
  const selectors = useToolSelectors(tool, id);
  const actions = useToolActions(tool, id);
  const server = useServer(tool);
  return { ...selectors, ...actions, ...server };
};
