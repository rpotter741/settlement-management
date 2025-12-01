const attributeValues = {
  name: '',
  cost: 0,
  health: 0,
  max: 0,
  description: '',
};

const attributeFields = {
  name: {
    label: 'Attribute Name',
    type: 'text',
    tooltip:
      "The unique name of the attribute. This should clearly convey the attribute's purpose and role within the settlement mechanics.",
    validateFn: (value: string) => {
      if (!value) return 'Attribute name is required';
      if (value.trim().length < 3)
        return 'Attribute name must be at least 3 characters long';
      return null; // No error
    },
    keypath: 'name',
  },
  costPerLevel: {
    label: 'Currency Cost',
    type: 'number',
    tooltip:
      "The amount of currency required per level to acquire this attribute. This cost scales with the settlement's level.",
    validateFn: (value: number) => {
      if (!value) return 'Cost per level is required';
      if (value <= 0) return 'Cost per level must be greater than 0';
      return null; // No error
    },
    keypath: 'balance.cost.base',
  },
  healthPerLevel: {
    label: 'Health Drain',
    type: 'number',
    tooltip:
      'This value represents the health damage the settlement takes for each missing unit of this attribute, scaled by settlement level.',
    validateFn: (value: number) => {
      if (value === null || value === undefined)
        return 'Health per level is required';
      if (value < 0) return 'Health per level cannot be negative';
      return null; // No error
    },
    keypath: 'balance.health.base',
  },
  maxPerLevel: {
    label: 'Max',
    type: 'number',
    tooltip:
      'The maximum number of units of this attribute that can provide benefits to the settlement per level.',
    validateFn: (value: number) => {
      if (value === undefined) return 'Max per level is required';
      if (value < 0) return 'Max per level must be 0 or greater';
      return null; // No error
    },
    keypath: 'balance.max.base',
  },
  description: {
    label: 'Description',
    type: 'textarea',
    tooltip:
      "A brief explanation of the attribute's purpose and impact. This provides essential context for understanding its role in the settlement.",
    validateFn: (value: string) => {
      if (!value) return 'Description is required';
      if (value.trim().length < 30)
        return `Description must be at least 30 characters long. You need ${30 - value.length} more characters.`;
      return null; // No error
    },
    keypath: 'description',
  },
  healthValuePerLevel: {
    label: 'Change Per Interval',
    type: 'number',
    tooltip:
      'The scaling factor for health per level. This value represents the scaling value per interval based on Health Drain.',
    validateFn: (value: number) => {
      if (value === null || value === undefined)
        return 'Health per level scale is required';
      return null; // No error
    },
    keypath: 'balance.health.valuePerLevel',
  },
  healthIntervalPerLevel: {
    label: 'Interval (Every N Levels)',
    type: 'number',
    tooltip:
      'The interval at which health is calculated based on the health drain. This value determines how often the health is updated.',
    validateFn: (value: number) => {
      if (value === null || value === undefined)
        return 'Health interval per level is required';
      if (value <= 0) return 'Health interval per level must be greater than 0';
      return null; // No error
    },
    keypath: 'balance.health.interval',
  },
  costValuePerLevel: {
    label: 'Change Per Interval',
    type: 'number',
    tooltip:
      'The scaling factor for cost per level. This value represents the scaling value per interval based on Cost.',
    validateFn: (value: number) => {
      if (value === null || value === undefined)
        return 'Cost per level scale is required';
      return null; // No error
    },
    keypath: 'balance.cost.valuePerLevel',
  },
  costIntervalPerLevel: {
    label: 'Interval (Every N Levels)',
    type: 'number',
    tooltip:
      'The interval at which cost is calculated based on the cost per level. This value determines how often the cost is updated.',
    validateFn: (value: number) => {
      if (value === null || value === undefined)
        return 'Cost interval per level is required';
      if (value <= 0) return 'Cost interval per level must be greater than 0';
      return null; // No error
    },
    keypath: 'balance.cost.interval',
  },
  maxValuePerLevel: {
    label: 'Change Per Interval',
    type: 'number',
    tooltip:
      'The scaling factor for max per level. This value represents the scaling value per interval based on Max.',
    validateFn: (value: number) => {
      if (value === null || value === undefined)
        return 'Max per level scale is required';
      return null; // No error
    },
    keypath: 'balance.max.valuePerLevel',
  },
  maxIntervalPerLevel: {
    label: 'Interval (Every N Levels)',
    type: 'number',
    tooltip:
      'The interval at which max is calculated based on the max per level. This value determines how often the max is updated.',
    validateFn: (value: number) => {
      if (value === null || value === undefined)
        return 'Max interval per level is required';
      if (value <= 0) return 'Max interval per level must be greater than 0';
      return null; // No error
    },
    keypath: 'balance.max.interval',
  },
};

export { attributeValues, attributeFields };
