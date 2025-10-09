const checklistContent = [
  {
    keypath: 'name',
    label: 'Name',
  },
  {
    keypath: 'description',
    label: 'Description',
  },
  {
    keypath: 'balance.maxPerLevel',
    label: 'Max Per Level',
  },
  {
    keypath: 'balance.healthPerLevel',
    label: 'Health Per Level',
  },
  {
    keypath: 'balance.costPerLevel',
    label: 'Cost Per Level',
  },
  {
    keypath: 'settlementPointCost.data',
    label: 'Settlement Point Cost',
    type: 'group',
  },
  {
    keypath: 'thresholds.data',
    label: 'Thresholds',
    type: 'group',
  },
];
export { checklistContent };
export default checklistContent;
