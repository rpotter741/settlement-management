import { BaseTool, GameStatus, GameStatusMode, Impact, UUID } from '../index';

export interface StepEntry {
  id: UUID;
  name: string;
  description?: string;
  impacts: Impact[];
}

export interface StatusTool extends BaseTool {
  type: GameStatus;
  mode: GameStatusMode;
  steps: StepEntry[];
}
