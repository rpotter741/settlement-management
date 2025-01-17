import iconList from '../../../components/shared/IconSelector/iconList';
import { v4 as newId } from 'uuid';

function initializeAttribute() {
  const tempId = newId(); // Temporary unique ID for the category

  // Generate thresholds
  const maxThresholds = [9, 29, 49, 69, 84, 99, 100];
  const thresholds = {};
  const thresholdsOrder = maxThresholds.map((max) => {
    const id = newId();
    thresholds[id] = { name: '', max };
    return id;
  });

  // Generate settlementPointCost
  const settlementPointCost = {};
  const settlementPointCostOrder = [];
  const defaultSettlementPointCostId = newId();
  settlementPointCost[defaultSettlementPointCostId] = {
    name: 'default',
    value: 1,
  };
  settlementPointCostOrder.push(defaultSettlementPointCostId);

  // Return the generated object
  return {
    id: tempId,
    name: '',
    description: '',
    gameState: {
      current: 0,
      max: 0,
      bonus: 0,
    },
    balance: {
      maxPerLevel: 0,
      healthPerLevel: 0,
      costPerLevel: 0,
    },
    thresholds,
    thresholdsOrder,
    settlementPointCost,
    settlementPointCostOrder,
    icon: { ...iconList[0] },
    iconColor: '#000000',
    tags: [],
    isValid: false,
    status: 'draft',
    credits: {
      createdBy: '',
      updatedAt: null,
      createdAt: new Date().toISOString(),
    },
  };
}

export default initializeAttribute;
