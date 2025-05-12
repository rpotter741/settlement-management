import { BaseTool, Icon, Balance, Thresholds, SPCs } from '../index';

export interface Attribute extends BaseTool {
  balance: Balance;
  icon: Icon;
  thresholds: Thresholds;
  settlementPointCost: SPCs;
}
