import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  validateField,
  validateTool,
} from 'features/validation/validationSlice';
import api from 'services/interceptor.js';
import { updateEdit, saveTool, setCurrent } from '../app/toolSlice.js';
import { toolSelectors as select } from '../app/toolSelectors.js';
import { loadTool } from '../app/toolThunks.js';

export const useToolActions = (tool) => {
  const dispatch = useDispatch();

  const updateTool = useCallback(
    (keypath, updates) => {
      dispatch(updateEdit({ tool, keypath, updates }));
    },
    [dispatch]
  );

  const validateToolField = useCallback(
    (keypath, error) => {
      dispatch(validateField({ tool, keypath, error }));
    },
    [dispatch]
  );

  const validateAll = useCallback(
    (refObj) => {
      dispatch(
        validateTool({
          tool,
          fields: Object.keys(refObj),
          refObj,
        })
      );
    },
    [dispatch]
  );

  const saveToolEdit = useCallback(
    (refId, overwriteCurrent = false) => {
      dispatch(saveTool({ tool, refId, overwriteCurrent }));
    },
    [dispatch]
  );

  const setCurrentTool = useCallback(
    (data, overwriteEdit = false) => {
      dispatch(setCurrent({ tool, data, overwriteEdit }));
    },
    [dispatch]
  );

  const loadNewTool = useCallback(
    ({ refId, id, setNew }) => {
      dispatch(loadTool({ tool, refId, id, setNew }));
    },
    [dispatch]
  );

  return {
    updateTool,
    validateToolField,
    validateAll,
    saveToolEdit,
    setCurrentTool,
    loadNewTool,
  };
};

export const useToolSelectors = (tool) => {
  const current = useSelector(select.current(tool));
  const edit = useSelector(select.edit(tool));
  const allIds = useSelector(select.allIds(tool));
  const byId = useSelector(select.byId(tool));
  const allTools = useSelector(select.allTools(tool));
  const errors = useSelector(select.errors(tool));

  const selectValue = (keypath) =>
    useSelector(select.selectValue(tool, keypath));

  return {
    current,
    edit,
    allIds,
    byId,
    allTools,
    errors,
    selectValue,
  };
};

export const useServer = (tool) => {
  const actions = {
    save: async (data) => {
      try {
        return await api.post(`/tools/${tool}/save`, {
          data: {
            ...data,
            contentType: 'OFFICIAL',
            createdBy: 'Admin',
          },
          tool,
        });
      } catch (error) {
        console.error('API error:', error.message);
        throw new Error(
          error.response?.data?.message || `Failed to ${type} data`
        );
      }
    },
    publish: async (data) => {
      const { refId, id } = data;
      try {
        return await api.post(`/tools/${tool}/publish`, {
          data: { refId, id },
          tool,
        });
      } catch (error) {
        console.error('API error:', error.message);
        throw new Error(
          error.response?.data?.message || `Failed to ${type} data`
        );
      }
    },
    delete: async (data) => {
      const { refId, id } = data;
      try {
        return await api.post('/tools/${tool}/delete', { refId, tool });
      } catch (error) {
        console.error('API error:', error.message);
        throw new Error(
          error.response?.data?.message || `Failed to ${type} data`
        );
      }
    },
  };

  const runServerActions = async (action, data, debug = false) => {
    try {
      if (!actions[action]) {
        throw new Error(`Unknown server action: ${action}`);
      }

      const response = await actions[action](data);
      if (debug) console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
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

export const useTools = (tool) => {
  const selectors = useToolSelectors(tool);
  const actions = useToolActions(tool);
  const server = useServer(tool);
  return { ...selectors, ...actions, ...server };
};
