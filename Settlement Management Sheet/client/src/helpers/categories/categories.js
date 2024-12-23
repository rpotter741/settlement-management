const categories = [
  {
    name: 'Survival',
    thresholds: [
      { max: 0.9, rating: 'Dying' },
      { max: 3.9, rating: 'Endangered' },
      { max: 4.9, rating: 'Unstable' },
      { max: 6.9, rating: 'Stable' },
      { max: 7.9, rating: 'Developing' },
      { max: 9, rating: 'Blossoming' },
      { max: 10, rating: 'Flourishing' },
    ],
  },
  {
    name: 'Safety',
    thresholds: [
      { max: 1, rating: 'Dangerous' },
      { max: 2, rating: 'Lawless' },
      { max: 4, rating: 'Unsafe' },
      { max: 6, rating: 'Safe' },
      { max: 8, rating: 'Guarded' },
      { max: 9, rating: 'Protected' },
      { max: 10, rating: 'Impregnable' },
    ],
  },
  {
    name: 'Economy',
    thresholds: [
      { max: 2, rating: 'Struggling' },
      { max: 3, rating: 'Fragile' },
      { max: 4, rating: 'Stagnant' },
      { max: 5, rating: 'Growing' },
      { max: 7, rating: 'Prosperous' },
      { max: 8, rating: 'Thriving' },
      { max: 10, rating: 'Golden Era' },
    ],
  },
];

export default categories;
