const attributeValidations = {
  name: (value) => {
    if (!value || value.trim().length < 3)
      return 'Name must be at least 3 characters.';
    return null;
  },
  description: (value) => {
    if (!value || value.trim().length < 30)
      return 'Description must be at least 30 characters.';
    return null;
  },
  balance: (values) => {
    const errors = {};
    if (!values.maxPerLevel && values.maxPerLevel !== 0) {
      errors.maxPerLevel = 'Max per level is required.';
    }
    if (values.maxPerLevel <= 0) {
      errors.maxPerLevel = 'Max per level must be greater than 0.';
    }
    if (values.maxPerLevel > 10) {
      errors.maxPerLevel = 'Max per level cannot be greater than 10.';
    }
    if (errors.maxPerLevel === undefined) {
      errors.maxPerLevel = null;
    }
    if (!values.healthPerLevel && values.healthPerLevel !== 0) {
      errors.healthPerLevel = 'Health per level is required.';
    }
    if (values.healthPerLevel < 0) {
      errors.healthPerLevel = 'Health per level cannot be negative.';
    }
    if (values.costPerLevel <= 0) {
      errors.costPerLevel = 'Cost per level must be greater than 0.';
    }
    if (errors.healthPerLevel === undefined) {
      errors.healthPerLevel = null;
    }
    if (errors.costPerLevel === undefined) {
      errors.costPerLevel = null;
    }
    return errors;
  },
  thresholds: (thresholds) => {
    return Object.entries(thresholds.data).reduce((errors, [id, threshold]) => {
      const thresholdErrors = {};

      if (!threshold.name || threshold.name.trim().length < 3) {
        thresholdErrors.name = 'Threshold name must be at least 3 characters.';
      } else {
        thresholdErrors.name = null;
      }

      if (threshold.max <= 0 || threshold.max > 100) {
        thresholdErrors.max = 'Threshold max must be between 1 and 100.';
      } else {
        thresholdErrors.max = null;
      }

      // Assign errors keyed by the threshold ID
      errors[id] = { ...thresholdErrors, id };
      return errors;
    }, {}); // Start with an empty object
  },

  settlementPointCost: (SPCS) => {
    return Object.entries(SPCS.data).reduce((errors, [id, spc]) => {
      const spcErrors = {};

      if (spc.value <= 0) {
        spcErrors.value = 'Value must be greater than 0.';
      } else {
        spcErrors.value = null;
      }

      // Assign errors keyed by the SPC ID
      errors[id] = { ...spcErrors, id, name: null }; // Keep `name` as `null` if necessary
      return errors;
    }, {}); // Start with an empty object
  },
};

export default attributeValidations;
