const emptyCategory = {
  name: '',
  attributes: [
    {
      name: '',
      values: {
        current: 0,
        maxPerLevel: 0,
        max: 0,
        bonus: 0,
      },
      costPerLevel: 0,
      attrition: {
        enabled: false,
        rate: 0,
        perLevel: false,
        interval: ' ',
      },
      retention: {
        enabled: false,
        rate: 0,
        perLevel: false,
        interval: ' ',
      },
      settlementPointCost: {
        default: 0,
      },
    },
  ],
  thresholds: [],
  dependencies: [],
  bonus: 0,
  type: 'custom',
};

const emptyThreshold = {
  max: 0,
  rating: ' ',
};

const emptyDependency = {
  target: ' ',
  conditions: [{ rating: ' ', modifier: 0 }],
};

const emptyCondition = {
  rating: ' ',
  modifier: 0,
};

const emptyAttribute = {
  name: ' ',
  values: {
    current: 0,
    maxPerLevel: 0,
    max: 0,
    bonus: 0,
  },
  costPerLevel: 0,
  attrition: {
    enabled: false,
    rate: 0,
    perLevel: false,
    interval: ' ',
  },
  retention: {
    enabled: false,
    rate: 0,
    perLevel: false,
    interval: ' ',
  },
  settlementPointCost: {
    default: 0,
  },
};

export {
  emptyCategory,
  emptyThreshold,
  emptyDependency,
  emptyCondition,
  emptyAttribute,
};
