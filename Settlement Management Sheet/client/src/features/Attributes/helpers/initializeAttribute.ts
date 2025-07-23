import { SPCs, Thresholds } from 'types/common.js';
import iconList from '../../../components/shared/IconSelector/iconList.js';
import { v4 as newId } from 'uuid';
import { scale } from 'framer-motion';

const defaultThresholds: Array<string> = [
  'Critical',
  'Strained',
  'Unstable',
  'Stable',
  'Improving',
  'Strong',
  'Thriving',
];

function initializeAttribute() {
  // Generate thresholds
  const maxThresholds = [9, 29, 49, 69, 84, 99, 100];
  const thresholds: Thresholds = {
    data: {},
    order: [],
  };
  thresholds.order = maxThresholds.map((max, n) => {
    const id = newId();
    thresholds.data[id] = { name: defaultThresholds[n], max };
    return id;
  });

  // Generate settlementPointCost
  const settlementPointCost: SPCs = {
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
    name: '',
    description: '',
    balance: {
      cost: {
        base: 0,
        perLevel: true,
        valuePerLevel: 1,
        interval: 1,
        scaleToggle: false,
        scaleCurve: 'linear',
        valuesPerInterval: [],
      },
      max: {
        base: 1,
        perLevel: true,
        valuePerLevel: 1,
        interval: 1,
        scaleToggle: false,
        scaleCurve: 'linear',
        valuesPerInterval: [],
      },
      health: {
        base: 0,
        perLevel: false,
        valuePerLevel: 0,
        interval: 1,
        scaleToggle: false,
        scaleCurve: 'linear',
        valuesPerInterval: [],
      },
    },
    thresholds,
    settlementPointCost,
    icon: {
      ...iconList[0],
      color: 'black',
      backgroundColor: '#fbf7ef',
    }, // Default icon with black color
    isPositive: true,
    canHurt: true,
    isTradeable: true,
    hasThresholds: true,
    hasSPC: true,
    genre: '',
    subGenre: '',
    properties: {
      data: {
        canOverflow: true,
        isCurrency: false,
        requiresUpkeep: false,
        canGather: false,
      },
      config: {},
      order: ['canOverflow', 'isCurrency', 'requiresUpkeep'],
    },
    tags: [],
    isValid: false,
    status: 'DRAFT',
    createdBy: '',
  };
}

export default initializeAttribute;
