import { BaseTool, UUID, EventSeverity } from '../index';

export interface KeySettings extends BaseTool {
  name: string;
  delay: number;
  duration: number;
  baseSeverity: EventSeverity | 'Random';
  minSeverity?: EventSeverity;
  maxSeverity?: EventSeverity;
  type: 'Increasing' | 'Decreasing' | 'Constant';
}

export interface KeyTool extends BaseTool {
  keySettings: KeySettings[];
}
