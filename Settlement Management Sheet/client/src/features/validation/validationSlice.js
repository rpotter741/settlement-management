import { createSlice } from '@reduxjs/toolkit';
import { get, set, cloneDeep } from 'lodash';
import validationsMap from './validationsMap.js';

const initialState = {
  attribute: {},
  category: {},
  event: {},
  weather: {},
  upgrade: {},
  building: {},
  settlement: {},
  settlementType: {},
  tradeHub: {},
  listener: {},
  apt: {},
};

const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setValidationObject: (state, action) => {
      const { tool, validationObject } = action.payload;
      state[tool] = validationObject;
    },
    validateField: (state, action) => {
      const { tool, keypath, error, id, field } = action.payload;
      if (keypath && id && field) {
        const targetArray = get(state[tool], keypath);
        if (Array.isArray(targetArray)) {
          const index = targetArray.findIndex((item) => item.id === id);
          if (index !== -1) {
            targetArray[index] = {
              ...targetArray[index],
              [field]: error,
            };
            set(state[tool], keypath, [...targetArray]);
          }
        }
      } else if (keypath) {
        set(state[tool], keypath, error);
      }
    },
    setErrorField: (state, action) => {
      const { tool, keypath, value } = action.payload;
      if (typeof value === 'object' && !Array.isArray(value)) {
        set(state[tool], keypath, { ...value });
      } else if (Array.isArray(value)) {
        set(state[tool], keypath, [...value]);
      } else {
        set(state[tool], keypath, value);
      }
      state[tool] = cloneDeep(state[tool]);
    },
    validateTool: (state, action) => {
      const { tool, fields, refObj } = action.payload;
      const validateFns = validationsMap[tool];
      if (!refObj || !validateFns) return;
      if (!state[tool]) state[tool] = {};
      fields.forEach((field) => {
        const error = validateFns[field](refObj[field]);
        state[tool][field] = error;
      });
      // refresh the state for all references
      state[tool] = { ...state[tool] };
    },
    clearValidation: (state, action) => {
      const { tool } = action.payload;
      state[tool] = {};
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

export const initializeObject = (obj, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return {};
  if (Array.isArray(obj)) {
    // Convert array to an object keyed by `id`
    return obj.reduce((acc, item) => {
      if (item && typeof item === 'object' && 'id' in item) {
        const { id, ...rest } = item; // Destructure `id` from the rest of the object
        acc[id] = initializeObject(rest, defaultValue); // Initialize the rest of the keys
      }
      return acc;
    }, {});
  }

  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      if (key === 'id' || key === 'refId') {
        acc[key] = obj[key]; // Keep `id` unchanged
      } else {
        acc[key] = initializeObject(obj[key], defaultValue); // Initialize other keys
      }
      return acc;
    }, {});
  }

  // Replace primitive values with the default
  return defaultValue;
};

export const initializeValidation = ({ tool, obj }) => {
  const activeObject = initializeObject(obj, null);
  return setValidationObject({ tool, validationObject: activeObject });
};

export const getErrorCount = (errors) => {
  let count = 0;

  const countErrors = (errorObj) => {
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
        if (key !== 'id') {
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

export default validationSlice.reducer;
