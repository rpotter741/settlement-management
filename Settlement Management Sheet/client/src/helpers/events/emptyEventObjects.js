const emptyThreshold = {
  category: '',
  attribute: '',
  operator: '',
  value: 0,
};

const thresholdOperatorOptions = [
  { value: 'lt', label: 'Less than' },
  { value: 'lte', label: 'Less than or equal to' },
  { value: 'gt', label: 'Greater than' },
  { value: 'gte', label: 'Greater than or equal to' },
  { value: 'eq', label: 'Equal to' },
];

const emptyCondition = {
  tags: [],
  thresholds: [{ ...emptyThreshold }],
  chance: 0,
};

const emptyImpact = {
  type: '',
  category: '',
  attribute: '',
  key: '',
  baseAmount: 1,
  immutable: false,
  conditions: [{ ...emptyCondition }],
};

const impactTypeOptions = [
  { value: 'category', label: 'Category' },
  { value: 'settlement', label: 'Settlement' },
  { value: 'status', label: 'Status' },
];

const impactCategoryOptions = [
  { value: 'Survival', label: 'Survival' },
  { value: 'Safety', label: 'Safety' },
  { value: 'Economy', label: 'Economy' },
];

const impactAttributeOptions = [
  {
    Survival: [
      { value: 'food', label: 'Food' },
      { value: 'supplies', label: 'Supplies' },
      { value: 'medicalCapacity', label: 'Medical Capacity' },
    ],
    Safety: [
      { value: 'defensiveInfrastructure', label: 'Defensive Infrastructure' },
      { value: 'intel', label: 'Intelligence' },
      { value: 'garrison', label: 'Garrison' },
    ],
    Economy: [
      { value: 'trade', label: 'Trade' },
      { value: 'laborPool', label: 'Labor Pool' },
      { value: 'craftsmanship', label: 'Craftsmanship' },
    ],
  },
];

const impactKeyOptions = [
  { value: 'current', label: 'Current' },
  { value: 'bonus', label: 'Bonus' },
  { value: null, label: 'None' },
];

const emptyPhase = {
  name: '',
  type: '',
  details: '',
  timeInDays: 0,
  laborNeeded: 0,
  impacts: {
    costs: [{ ...emptyImpact }],
    rewards: [],
  },
};

const phaseTypeOptions = [
  { value: 'null', label: 'Select a type' },
  { value: 'Immediate', label: 'Immediate' },
  { value: 'Active', label: 'Active' },
  { value: 'Passive', label: 'Passive' },
  { value: 'Indefinite', label: 'Indefinite' },
];

const emptyGuardImpact = {
  location: '',
  category: '',
  value: 0,
  prevent: 0,
};

const guardLocationOptions = [
  { value: 'Settlement', label: 'Settlement' },
  { value: 'Walls', label: 'Walls' },
  { value: 'Granary', label: 'Granary' },
  { value: 'Market', label: 'Market' },
  { value: 'Barracks', label: 'Barracks' },
  { value: 'School', label: 'School' },
  { value: 'Infirmary', label: 'Infirmary' },
];

const emptyLink = {
  type: '',
  events: [],
};

const linkTypeOptions = [
  { value: 'DM', label: 'DM' },
  { value: 'player', label: 'Player' },
  { value: 'auto', label: 'Auto' },
];

const emptyEvent = {
  name: '',
  recurring: false,
  startDate: null,
  phases: [{ ...emptyPhase }],
  guardImpact: { ...emptyGuardImpact },
  timeInDays: 0,
  categories: [],
  details: '',
  link: null,
  tags: [],
  flavorText: {
    Low: '',
    Moderate: '',
    High: '',
    Extreme: '',
  },
};

export {
  emptyImpact,
  emptyPhase,
  emptyGuardImpact,
  emptyEvent,
  emptyCondition,
  emptyThreshold,
  thresholdOperatorOptions,
  impactCategoryOptions,
  impactAttributeOptions,
  impactKeyOptions,
  impactTypeOptions,
  phaseTypeOptions,
  guardLocationOptions,
  linkTypeOptions,
  emptyLink,
};
