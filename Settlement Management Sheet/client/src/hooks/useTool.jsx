import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  validateField,
  validateTool,
} from 'features/validation/validationSlice';
import api from 'services/interceptor.js';
import { updateById, saveTool } from '../app/toolSlice.js';
import { toolSelectors as select } from '../app/toolSelectors.js';
import { loadTool } from '../app/toolThunks.js';

export const useToolActions = (tool, id) => {
  const dispatch = useDispatch();

  const updateTool = useCallback(
    (keypath, updates) => {
      console.log(keypath, updates);
      dispatch(updateById({ id, tool, keypath, updates }));
    },
    [dispatch]
  );

  const validateToolField = useCallback(
    (keypath, error) => {
      dispatch(validateField({ id, tool, keypath, error }));
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
    (overwriteCurrent = false) => {
      dispatch(saveTool({ tool, id, overwriteCurrent }));
    },
    [dispatch]
  );

  const loadNewTool = useCallback(
    ({ refId, id, currentTool }) => {
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

export const useToolSelectors = (tool, id) => {
  const current = useSelector(select.byId(tool, id));
  const edit = useSelector(select.byEditId(tool, id));
  const allIds = useSelector(select.allIds(tool));
  const allEditIds = useSelector(select.allEditIds(tool));
  const allTools = useSelector(select.allTools(tool));
  const allEditTools = useSelector(select.allEditTools(tool));
  const errors = useSelector(select.errors(tool));
  const dirty = useSelector(select.changes(tool, id));

  const selectValue = (keypath) =>
    useSelector(select.selectValue(tool, id, keypath));

  const selectEditValue = (keypath) =>
    useSelector(select.selectEditValue(tool, id, keypath));

  return {
    current,
    edit,
    allIds,
    allEditIds,
    allTools,
    allEditTools,
    errors,
    selectValue,
    selectEditValue,
    dirty,
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
        throw new Error(error.response?.data?.message || `Failed to save data`);
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
          error.response?.data?.message || `Failed to publish data`
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
          error.response?.data?.message || `Failed to delete data`
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

export const useTools = (tool, id) => {
  const selectors = useToolSelectors(tool, id);
  const actions = useToolActions(tool, id);
  const server = useServer(tool, id);
  return { ...selectors, ...actions, ...server };
};
