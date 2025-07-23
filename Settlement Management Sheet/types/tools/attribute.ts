import { BaseTool, Icon, Balance, Thresholds, SPCs } from '../index';

export interface AttrProperties {
  canOverflow: boolean;
  isCurrency: boolean;
  canBeCrafted: boolean;
  requiresMaintenance: boolean;
}

export interface Attribute extends BaseTool {
  balance: Balance;
  icon: Icon;
  thresholds: Thresholds;
  settlementPointCost: SPCs;
  isPositive: boolean;
  canHurt: boolean;
  isTradeable: boolean;
  hasThresholds: boolean;
  properties: {
    data: AttrProperties;
    order: (keyof AttrProperties)[];
  };
}
