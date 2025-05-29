import iconList from '../../../components/shared/IconSelector/iconList';
import { v4 as newId } from 'uuid';

function initializeAttribute() {
  // Generate thresholds
  const maxThresholds = [9, 29, 49, 69, 84, 99, 100];
  const thresholds = {
    data: {},
    order: [],
  };
  thresholds.order = maxThresholds.map((max) => {
    const id = newId();
    thresholds.data[id] = { name: '', max };
    return id;
  });

  // Generate settlementPointCost
  const settlementPointCost = {
    data: {},
    order: [],
  };
  const defaultSettlementPointCostId = newId();
  settlementPointCost.data[defaultSettlementPointCostId] = {
    name: 'default',
    value: 1,
  };
  settlementPointCost.order = [defaultSettlementPointCostId];

  // Return the generated object
  return {
    id: newId(),
    refId: newId(),
    version: 1,
    positive: true,
    name: '',
    description: '',
    balance: {
      maxPerLevel: 0,
      healthPerLevel: 0,
      costPerLevel: 0,
    },
    thresholds,
    settlementPointCost,
    icon: {
      ...iconList[0],
      color: 'slateblue',
      backgroundColor: '#fbf7ef',
    }, // Default icon with black color
    tags: [],
    isValid: false,
    status: 'DRAFT',
    createdBy: '',
  };
}

export default initializeAttribute;
