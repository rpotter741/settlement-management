import { BaseTool, UUID, KeySettings, Impact, Icon } from '../index';

export interface BasicGradient {
  type: 'linear' | 'radial';
  startColor: string;
  endColor: string;
  angle?: number; // Only relevant for linear gradients
}

export interface GradientStop {
  color: string;
  position: number; // 0-100, representing percentage
}

export interface MultiStopGradient {
  type: 'linear' | 'radial';
  stops: GradientStop[];
  angle?: number;
}

export type Gradient = BasicGradient | MultiStopGradient;

export interface APTDisplay {
  type: 'circle' | 'line' | 'icon';
  gradient?: Gradient | null;
  icon?: Icon | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor?: string | null;
  borderColor?: string | null;
}

export interface APTEvent {
  id: UUID;
  refId: UUID;
  triggered: boolean;
  keyOverride?: KeySettings | null;
  impactOverride?: Impact[] | null;
}

export interface APT extends BaseTool {
  display: APTDisplay;
  eventThresholds: Record<number, Partial<APTEvent>[]>;
  progressType: 'increase' | 'decrease';
  decay: number;
}
