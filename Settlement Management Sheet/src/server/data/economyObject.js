import CustomCategory from '../classes/customCategoryClass';

const attributes = [
  {
    name: 'Trade',
    internalName: 'trade',
    startingValue: 5,
    startingBonus: 0,
    maxPerLevel: 5,
    costPerLevel: 83,
    settlementPointCost: {
      default: 2,
      'Mercantile': 1,
      'Survivalist': 3,
      'Fortified': 2
    }
  },
  {
    name: 'Craftsmanship',
    internalName: 'craftsmanship',
    startingValue: 2,
    startingBonus: 0,
    maxPerLevel: 3,
    costPerLevel: 115,
    settlementPointCost: {
      default: 2,
      'Mercantile': 3,
      'Survivalist': 1,
      'Fortified': 2,
    },
  },
  {
    name: 'Labor Pool',
    internalName: 'laborPool',
    startingValue: 1,
    startingBonus: 0,
    maxPerLevel: 2,
    costPerLevel: 150,
    settlementPointCost: {
      default: 2,
      'Mercantile': 2,
      'Survivalist': 2,
      'Fortified': 3
  },
}
]

const thresholds = [
  { max: 2, rating: 'Struggling' },
  { max: 3, rating: 'Fragile' },
  { max: 4, rating: 'Stagnant' },
  { max: 5, rating: 'Growing' },
  { max: 7, rating: 'Prosperous' },
  { max: 8, rating: 'Thriving' },
  { max: Infinity, rating: 'Golden Era' },
]

const dependencies = [
  {
    target: 'Safety',
    conditions: [
      {rating: 'Dangerous', modifier: 0.2},
      {rating: 'Lawless', modifier: 0.5},
      {rating: 'Unsafe', modifier: 0.9},
      {rating: 'Safe', modifier: 1.0},
      {rating: 'Guarded', modifier: 1.05},
      {rating: 'Protected', modifier: 1.1},
      {rating: 'Impregnable', modifier: 1.2},
    ]
  }
]


const Economy = new CustomCategory(
  'Economy',
  1,
  attributes,
  thresholds,
  dependencies
)

export default Economy;
