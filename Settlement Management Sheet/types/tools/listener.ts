import { ConditionEventPair } from '../index';

export interface ListenerPack {
  id: string;
  name: string;
  description?: string;
  conditionEventPairs: ConditionEventPair[];
  active: boolean;
}
