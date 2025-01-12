export const validateName = (value) => {
  if (!value) return 'Name is required';
  if (value.length < 3) return 'Name must be at least 3 characters';
  return null;
};

export const validateDescription = (value) => {
  if (!value) return 'Description is required';
  if (value.length < 30)
    return `Description must be at least 30 characters. You have ${30 - value.length} characters remaining.`;
  return null;
};

export const validateThresholdMax = (value) => {
  if (value < 0 || value > 100) return 'Value must be between 0 and 100';
  return null;
};

export const validateThresholdName = (value) => {
  if (!value) return 'Threshold Name is required';
  if (value.length < 3) return 'Threshold Name must be at least 3 characters';
  return null;
};

export const validateThresholds = (thresholds) => {
  if (!thresholds) return 'Thresholds are required';
  return thresholds.map((threshold) => {
    return {
      name: validateThresholdName(threshold.name),
      max: validateThresholdMax(threshold.max),
    };
  });
};

const sharedValidations = {
  initializeObject,
  validateName,
  validateDescription,
  validateThresholds,
  validateThresholdMax,
  validateThresholdName,
};

export default sharedValidations;
