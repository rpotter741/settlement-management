import { BaseTool, UUID, EventSeverity } from '../index';

export interface KeySettings extends BaseTool {
  delay: number;
  duration: number;
  severityOverTime: Partial<Record<EventSeverity, number>>;
  type: 'Increasing' | 'Decreasing' | 'Constant';
}

export interface KeyTool extends BaseTool {
  keySettings: KeySettings[];
}
