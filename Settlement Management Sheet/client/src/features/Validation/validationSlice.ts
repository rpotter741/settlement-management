// validationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { get, set, cloneDeep } from 'lodash';
import validationsMap from './validationsMap';
import {
  ValidationState,
  SetValidationObjectPayload,
  ValidateFieldPayload,
  ValidateToolPayload,
  ClearValidationPayload,
  SetErrorFieldPayload,
} from './types';

const initialState: ValidationState = {
  attribute: {
    byId: {},
    allIds: [],
  },
  key: { byId: {}, allIds: [] },
  gameStatus: { byId: {}, allIds: [] },
  faction: { byId: {}, allIds: [] },
  kit: { byId: {}, allIds: [] },
  action: { byId: {}, allIds: [] },
  storyThread: { byId: {}, allIds: [] },
  category: { byId: {}, allIds: [] },
  event: { byId: {}, allIds: [] },
  weather: { byId: {}, allIds: [] },
  upgrade: { byId: {}, allIds: [] },
  building: { byId: {}, allIds: [] },
  settlement: { byId: {}, allIds: [] },
  settlementType: { byId: {}, allIds: [] },
  tradeHub: { byId: {}, allIds: [] },
  listener: { byId: {}, allIds: [] },
  apt: { byId: {}, allIds: [] },
};

const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setValidationObject: (
      state,
      action: PayloadAction<SetValidationObjectPayload>
    ) => {
      const { tool, id, validationObject } = action.payload;
      state[tool].byId[id] = {
        ...state[tool].byId[id],
        ...validationObject,
      };
    },
    validateField: (state, action: PayloadAction<ValidateFieldPayload>) => {
      const { tool, keypath, error, id } = action.payload;
      if (!state[tool].byId[id]) state[tool].byId[id] = { id, refId: '' };
      set(state[tool].byId[id], keypath, error);
    },
    setErrorField: (state, action: PayloadAction<SetErrorFieldPayload>) => {
      const { tool, id, keypath, value } = action.payload;
      if (typeof value === 'object' && !Array.isArray(value)) {
        set(state[tool].byId[id], keypath, { ...value });
      } else if (Array.isArray(value)) {
        set(state[tool].byId[id], keypath, [...value]);
      } else {
        set(state[tool].byId[id], keypath, value);
      }
      state[tool].byId[id] = cloneDeep(state[tool].byId[id]);
    },
    validateTool: (state, action: PayloadAction<ValidateToolPayload>) => {
      const { tool, id, fields, refObj } = action.payload;
      const validateFns = validationsMap[tool as keyof typeof validationsMap];
      if (!refObj || !validateFns) return;
      if (!state[tool].byId[id]) state[tool].byId[id] = { id, refId: '' };
      fields.forEach((field: string) => {
        const error = validateFns[field](refObj[field]);
        state[tool].byId[id][field] = error;
      });
      // refresh the state for all references
      state[tool] = { ...state[tool] };
    },
    clearValidation: (state, action: PayloadAction<ClearValidationPayload>) => {
      const { tool, id } = action.payload;
      delete state[tool].byId[id];
    },
  },
});

export const {
  setValidationObject,
  validateField,
  validateTool,
  clearValidation,
  setErrorField,
} = validationSlice.actions;

export default validationSlice.reducer;

export const initializeObject = <T extends Record<string, any>>(
  obj: T,
  defaultValue: any = null
): T => {
  if (!obj || typeof obj !== 'object') return defaultValue;

  if (Array.isArray(obj)) {
    // Return an array where each element is initialized
    return obj.map((item) =>
      typeof item === 'object' && item !== null
        ? initializeObject(item, defaultValue)
        : defaultValue
    ) as unknown as T;
  }

  return Object.keys(obj).reduce((acc: any, key) => {
    const value = obj[key];

    if (key === 'id' || key === 'refId') {
      acc[key] = value; // Preserve `id` and `refId`
    } else if (typeof value === 'object' && value !== null) {
      acc[key] = initializeObject(value, defaultValue); // Recurse for nested objects
    } else {
      acc[key] = defaultValue; // Replace primitive values
    }

    return acc;
  }, {} as T);
};

export const getErrorCount = (errors: Record<string, any>) => {
  let count = 0;
  console.log('getErrorCount', errors);

  const countErrors = (errorObj: any) => {
    if (Array.isArray(errorObj)) {
      // If it's an array, count non-null/undefined values
      errorObj.forEach((item) => {
        if (item && typeof item === 'object') {
          countErrors(item); // Recursively check nested objects/arrays
        } else if (item !== null && item !== undefined) {
          count++;
        }
      });
    } else if (errorObj && typeof errorObj === 'object') {
      // If it's an object, traverse its keys
      Object.entries(errorObj).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'refId') {
          countErrors(value); // Recursively check nested objects/arrays
        }
      });
    } else if (errorObj !== null && errorObj !== undefined) {
      // Count primitive values that are not null or undefined
      count++;
    }
  };

  countErrors(errors); // Start recursion
  return count;
};
