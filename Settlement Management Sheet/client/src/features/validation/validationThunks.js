import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeObject, setValidationObject } from './validationSlice';
import { getErrorCount, validateTool } from './validationSlice';

export const initializeValidationForTool = createAsyncThunk(
  'validation/initializeForTool',
  async ({ tool, obj }, { getState, dispatch }) => {
    if (activeObject) {
      const validationObject = initializeObject(obj, null);
      dispatch(setValidationObject({ tool, validationObject }));
    }
  }
);

export const validateAndCheckErrors = createAsyncThunk(
  'validation/validateAndCheckErrors',
  async ({ tool, fields, validateFns }, { getState, dispatch }) => {
    await dispatch(
      validateTool({
        tool,
        fields,
        validateFns,
      })
    );

    // Access updated state
    const state = getState();
    const errors = state.validation[tool]; // Adjust to your state structure
    const errorCount = getErrorCount(errors);

    return errorCount;
  }
);
