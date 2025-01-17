const examples = {
  food: {
    max: 10,
    cost: 2,
    health: 2,
  },
  supplies: {
    mal: 6,
    cost: 12,
    health: 1,
  },
  medical: {
    max: 3,
    cost: 20,
    health: 10,
  },
  di: {
    max: 3,
    cost: null,
    health: null,
  },
  intel: {
    max: 1,
    cost: 25,
    health: 0,
  },
  garrison: {
    max: 4,
    cost: 30,
    health: 3,
  },
  trade: {
    max: 8,
    cost: 15,
    health: 1,
  },
  laborPool: {
    max: 5,
    cost: 10,
    health: 2,
  },
  shelter: {
    max: 6,
    cost: null,
    health: 5,
  },
  craftsmanship: {
    max: 3,
    cost: 25,
    health: 1,
  },
  culture: {
    max: 4,
    cost: 30,
    health: null,
  },
};

const autobalanceSteps = {
  costPerLevel: {
    2: { maxPerLevel: 10, healthPerLevel: 2 },
    5: { maxPerLevel: 8, healthPerLevel: 2 },
    10: { maxPerLevel: 6, healthPerLevel: 3 },
    20: { maxPerLevel: 4, healthPerLevel: 4 },
    25: { maxPerLevel: 3, healthPerLevel: 5 },
    40: { maxPerLevel: 2, healthPerLevel: 5 },
  },
  maxPerLevel: {
    10: { costPerLevel: 2, healthPerLevel: 2 },
    8: { costPerLevel: 5, healthPerLevel: 2 },
    6: { costPerLevel: 10, healthPerLevel: 3 },
    4: { costPerLevel: 20, healthPerLevel: 4 },
    3: { costPerLevel: 25, healthPerLevel: 5 },
    2: { costPerLevel: 40, healthPerLevel: 5 },
  },
};

export default autobalanceSteps;
