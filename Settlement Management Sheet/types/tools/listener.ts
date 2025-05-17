import { BaseTool, ConditionEventPair } from '../index';

export interface ListenerPack extends BaseTool {
  conditionEventPairs: ConditionEventPair[];
  active?: boolean;
}
