import CustomCategory from '../classes/customCategoryClass';

const attributes = [
  {
    name: 'Defensive Infrastructure',
    internalName: 'defensiveInfrastructure',
    startingValue: 5,
    startingBonus: 0,
    maxPerLevel: 5,
    costPerLevel: 50,
    settlementPointCost: {
      default: 2,
      Mercantile: 2,
      Survivalist: 2,
      Fortified: 1,
    },
  },
  {
    name: 'Intelligence',
    internalName: 'intelligence',
    startingValue: 3,
    startingBonus: 0,
    maxPerLevel: 2,
    costPerLevel: 75,
    settlementPointCost: {
      default: 2,
      Mercantile: 3,
      Survivalist: 2,
      Fortified: 1,
    },
  },
  {
    name: 'Garrison',
    internalName: 'garrison',
    startingValue: 1,
    startingBonus: 0,
    maxPerLevel: 3,
    costPerLevel: 100,
    settlementPointCost: {
      default: 3,
      Mercantile: 3,
      Survivalist: 3,
      Fortified: 2,
    },
  },
];

const thresholds = [
  { max: 1, rating: 'Dangerous' },
  { max: 2, rating: 'Lawless' },
  { max: 4, rating: 'Unsafe' },
  { max: 6, rating: 'Safe' },
  { max: 8, rating: 'Guarded' },
  { max: 9, rating: 'Protected' },
  { max: 10, rating: 'Impregnable' },
];

const dependencies = [
  {
    target: 'Survival',
    conditions: [
      { rating: 'Dying', modifier: 0.1 },
      { rating: 'Endangered', modifier: 0.7 },
      { rating: 'Unstable', modifier: 0.85 },
      { rating: 'Stable', modifier: 1.0 },
      { rating: 'Developing', modifier: 1.05 },
      { rating: 'Blossoming', modifier: 1.1 },
      { rating: 'Flourishing', modifier: 1.2 },
    ],
  },
];

const Safety = new CustomCategory(
  'Safety',
  1,
  attributes,
  thresholds,
  dependencies
);

export default Safety;
