const attributeValues = {
  name: '',
  costPerLevel: 0,
  healthPerLevel: 0,
  maxPerLevel: 0,
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
      if (value.length < 3)
        return 'Attribute name must be at least 3 characters long';
      return null; // No error
    },
    keypath: 'name',
  },
  costPerLevel: {
    label: 'Currency Cost Per Level',
    type: 'number',
    tooltip:
      "The amount of currency required per level to acquire this attribute. This cost scales with the settlement's level.",
    validateFn: (value: number) => {
      if (!value) return 'Cost per level is required';
      if (value <= 0) return 'Cost per level must be greater than 0';
      return null; // No error
    },
    keypath: 'balance.costPerLevel',
  },
  healthPerLevel: {
    label: 'Health Drain Per Level',
    type: 'number',
    tooltip:
      'This value represents the health damage the settlement takes for each missing unit of this attribute, scaled by settlement level.',
    validateFn: (value: number) => {
      if (value === null || value === undefined)
        return 'Health per level is required';
      if (value < 0) return 'Health per level cannot be negative';
      return null; // No error
    },
    keypath: 'balance.healthPerLevel',
  },
  maxPerLevel: {
    label: 'Max Per Level',
    type: 'number',
    tooltip:
      'The maximum number of units of this attribute that can provide benefits to the settlement per level.',
    validateFn: (value: number) => {
      if (!value) return 'Max per level is required';
      if (value <= 0) return 'Max per level must be greater than 0';
      if (value > 10) return 'Max per level cannot be greater than 10';
      return null; // No error
    },
    keypath: 'balance.maxPerLevel',
  },
  description: {
    label: 'Description',
    type: 'textarea',
    tooltip:
      "A brief explanation of the attribute's purpose and impact. This provides essential context for understanding its role in the settlement.",
    validateFn: (value: string) => {
      if (!value) return 'Description is required';
      if (value.length < 30)
        return `Description must be at least 30 characters long. You need ${30 - value.length} more characters.`;
      return null; // No error
    },
    keypath: 'description',
  },
};

export { attributeValues, attributeFields };
