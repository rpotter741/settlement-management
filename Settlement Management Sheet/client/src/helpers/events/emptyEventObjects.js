const emptyThreshold = {
  category: '',
  attribute: '',
  operator: '',
  value: 0,
};

const thresholdOperatorOptions = [
  { value: 'lt', label: '<' },
  { value: 'lte', label: '<=' },
  { value: 'gt', label: '>' },
  { value: 'gte', label: '>=' },
  { value: 'eq', label: '=' },
];

const emptyCondition = {
  tags: [],
  thresholds: [{ ...emptyThreshold }],
  frequency: '',
};

const emptyImpact = {
  type: '',
  category: '',
  attribute: '',
  key: '',
  baseAmount: 1,
  immutable: false,
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
      { value: 'score', label: 'Score' },
    ],
    Safety: [
      { value: 'defensiveInfrastructure', label: 'Defensive Infrastructure' },
      { value: 'intel', label: 'Intelligence' },
      { value: 'garrison', label: 'Garrison' },
      { value: 'score', label: 'Score' },
    ],
    Economy: [
      { value: 'trade', label: 'Trade' },
      { value: 'laborPool', label: 'Labor Pool' },
      { value: 'craftsmanship', label: 'Craftsmanship' },
      { value: 'score', label: 'Score' },
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
  conditions: { ...emptyCondition },
  flavorText: {
    trivial: '',
    low: '',
    moderate: '',
    high: '',
    catastrophic: '',
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
