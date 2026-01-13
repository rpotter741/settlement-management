const impactTypeOptions = [
  { value: 'category', label: 'Category' },
  { value: 'settlement', label: 'Settlement' },
  { value: 'status', label: 'Status' },
];

const impactCategoryOptions = {
  category: [
    { value: 'economy', label: 'Economy' },
    { value: 'safety', label: 'Safety' },
    { value: 'survival', label: 'Survival' },
  ],
  settlement: [
    { value: 'building', label: 'Building' },
    { value: 'vault', label: 'Currency' },
    { value: 'health', label: 'Health' },
    { value: 'laborPool', label: 'Labor Pool' },
    { value: 'supplies', label: 'Supplies' },
  ],
  status: [
    { value: 'fear', label: 'Fear' },
    { value: 'inspired', label: 'Inspired' },
    { value: 'riotous', label: 'Riotous' },
    { value: 'discontent', label: 'Discontent' },
    { value: 'frivolous', label: 'Frivolous' },
  ],
};

const impactAttributeOptions = {
  economy: [
    { value: 'trade', label: 'Trade' },
    { value: 'craftsmanship', label: 'Craftsmanship' },
    { value: 'culture', label: 'Culture' },
  ],
  safety: [
    { value: 'defensiveInfrastructure', label: 'Defensive Infrastructure' },
    { value: 'intel', label: 'Intelligence' },
    { value: 'garrison', label: 'Garrison' },
  ],
  survival: [
    { value: 'food', label: 'Food' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'medicalCapacity', label: 'Medical Capacity' },
  ],
  building: [
    { value: 'wells', label: 'Wells' },
    { value: 'barracks', label: 'Barracks' },
    { value: 'granary', label: 'Granary' },
    { value: 'market', label: 'Market' },
    { value: 'school', label: 'School' },
    { value: 'censusOffice', label: 'Census Office' },
    { value: 'infirmary', label: 'Infirmary' },
    { value: 'intelligenceNetwork', label: 'Intelligence Network' },
    { value: 'walls', label: 'Walls' },
  ],
  vault: [
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'copper', label: 'Copper' },
    { value: 'credits', label: 'Credits' },
  ],
};

const impactKeyOptions = {
  economy: [
    { value: 'current', label: 'Current' },
    { value: 'bonus', label: 'Bonus' },
  ],
  safety: [
    { value: 'current', label: 'Current' },
    { value: 'bonus', label: 'Bonus' },
  ],
  survival: [
    { value: 'current', label: 'Current' },
    { value: 'bonus', label: 'Bonus' },
  ],
  building: [
    { value: 'toughness', label: 'Toughness' },
    { value: 'complexity', label: 'Complexity' },
    { value: 'health', label: 'Health' },
  ],
  vault: [{ value: 'current', label: 'Current' }],
  health: [
    { value: 'current', label: 'Current' },
    { value: 'bonus', label: 'Bonus' },
  ],
  laborPool: [
    { value: 'current', label: 'Current' },
    { value: 'bonus', label: 'Bonus' },
  ],
  supplies: [
    { value: 'current', label: 'Current' },
    { value: 'bonus', label: 'Bonus' },
  ],
};

export {
  impactTypeOptions,
  impactCategoryOptions,
  impactAttributeOptions,
  impactKeyOptions,
};
