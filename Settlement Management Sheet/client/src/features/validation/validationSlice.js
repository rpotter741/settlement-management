import { createSlice } from '@reduxjs/toolkit';

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
    initializeValidation: (state, action) => {
      const { tool, initialValidationState } = action.payload;
      state[tool] = initialValidationState;
    },
    validateField: (state, action) => {
      const { tool, field, value, validateFn } = action.payload;
      const error = validateFn(value);
      state.tools[tool][field] = error;
    },
    validateTool: (state, action) => {
      const { tool, fields, validateFns } = action.payload;
      fields.forEach((field) => {
        const error = validateFns[field](state.tools[tool][field]);
        state[tool][field] = error;
      });
    },
    clearValidation: (state, action) => {
      const { tool } = action.payload;
      state[tool] = {};
    },
  },
});

export const {
  initializeValidation,
  validateField,
  validateTool,
  clearValidation,
} = validationSlice.actions;

export const initializeObject = (obj, defaultValue = null) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => initializeObject(item, defaultValue));
  }

  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = initializeObject(obj[key], defaultValue);
      return acc;
    }, {});
  }

  return defaultValue; // Base case: Replace values with the default
};

export default validationSlice.reducer;
