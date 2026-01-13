import { UUID, Impact } from './index';

export type ConditionType =
  | 'ATTRIBUTE_CHECK'
  | 'APT_THRESHOLD'
  | 'RESOURCE_CHECK'
  | 'EVENT_FLAG'
  | 'SETTLEMENT_STATUS';

export interface Condition {
  id: UUID;
  type: ConditionType;
  target: string;
  operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
  value: number | string | boolean;
  duration?: number;
  key?: string;
}

export interface ConditionEventPair {
  conditions: Condition[];
  eventIds: UUID[];
}

export interface ConditionalResolution {
  id: UUID;
  name: string;
  description?: string;
  conditions: Condition[];
  impacts: Impact[];
  keys: string[];
  autoResolve?: boolean;
}
