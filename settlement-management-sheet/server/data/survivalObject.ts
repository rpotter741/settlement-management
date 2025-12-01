import CustomCategory from '../classes/customCategoryClass';

const attributes = [
  {
    name: 'Food',
    internalName: 'food',
    startingValue: 5,
    startingBonus: 0,
    maxPerLevel: 5,
    costPerLevel: 30,
    settlementPointCost: {
      default: 1,
      Mercantile: 1,
      Survivalist: 1,
      Fortified: 2,
    },
  },
  {
    name: 'Shelter',
    internalName: 'shelter',
    startingValue: 3,
    startingBonus: 0,
    maxPerLevel: 3,
    costPerLevel: 60,
    settlementPointCost: {
      default: 2,
      Mercantile: 2,
      Survivalist: 1,
      Fortified: 3,
    },
  },
  {
    name: 'Medical Capacity',
    internalName: 'medical',
    startingValue: 1,
    startingBonus: 0,
    maxPerLevel: 2,
    costPerLevel: 75,
    settlementPointCost: {
      default: 3,
      Mercantile: 3,
      Survivalist: 2,
      Fortified: 3,
    },
  },
];

const thresholds = [
  { max: 0.9, rating: 'Dying' },
  { max: 3.9, rating: 'Endangered' },
  { max: 4.9, rating: 'Unstable' },
  { max: 6.9, rating: 'Stable' },
  { max: 7.9, rating: 'Developing' },
  { max: 9, rating: 'Blossoming' },
  { max: 10, rating: 'Flourishing' },
];

const dependencies = []; // no dependencies

const Survival = new CustomCategory(
  'Survival',
  1,
  attributes,
  thresholds,
  dependencies
);

export default Survival;
