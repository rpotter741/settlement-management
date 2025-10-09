import { v4 as newId } from 'uuid';

const initializeCategory = () => {
  const maxThresholds = [9, 29, 49, 69, 84, 99, 100];
  const thresholds = {};
  const thresholdsOrder = maxThresholds.map((max) => {
    const id = newId();
    thresholds[id] = { name: '', max };
    return id;
  });
  return {
    id: newId(),
    refId: newId(),
    version: 1,
    name: '',
    description: '',
    attributes: [],
    thresholds: {
      data: thresholds,
      order: thresholdsOrder,
    },
    dependencies: {
      data: {},
      order: [],
    },
    tags: [],
    isValid: false,
    status: 'DRAFT',
    createdBy: '',
  };
};

export default initializeCategory;

/*
  example category:
  id: 'temp-123456',
  name: 'Survival',
  description: 'Food, Shelter, Medical Capacity, etc',
  attributes: ['someid', 'someotherid'],
  thresholds: {
    data: {
      'someid': { name: '', max: 33, range: [0, 33] },
      'someotherid': { name: '', max: 69, range: [34, 69] },
    },
    order: ['someotherid', 'someid'],
    },
    dependencies: {
      someCategoryId: {
        name: 'someCategoryName',
        thresholds: {
          'someid': { name: 'predefinedThreshold', modifier: 33 },}
      }
    }
*/
