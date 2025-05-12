import {
  BaseTool,
  Condition,
  ReplacementTuple,
  FlavorText,
  KeyTool,
  UUID,
  Impact,
} from '../index';

export type EventType = 'ACTIVE' | 'IMMEDIATE' | 'PASSIVE' | 'INDEFINITE';

export interface EventPhase {
  id: UUID;
  name: string;
  description?: string;
  flavorText?: FlavorText;
  type: EventType;
  impacts: Impact[];
  resolutions: EventResolution[];
  nextPhaseId?: UUID;
  duration?: number; // for passive events
  productivity?: number; // for active events
  exposedKeys?: UUID[]; // keys that are exposed in this phase
  isTerminal?: boolean; // wraps up the thread
}

export interface EventResolution {
  id: UUID;
  name: string;
  description?: string;
  impacts: Impact[];
  keys: UUID[];
  branches: Branch[];
  successId?: UUID;
  failureId?: UUID;
}

export interface Branch {
  branchId: UUID;
  conditions: Condition[];
  originPhaseId: UUID;
  nextPhaseId: UUID | null;
  fallbackPhaseId?: UUID | null;
  priority?: number;
}

export interface Thread extends BaseTool {
  flavorText: FlavorText;
  narrativeWeight?: 'TRIVIAL' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
  phases: EventPhase[];
  replacement?: ReplacementTuple;
  links?: UUID[];
  entryPhaseId: UUID;
}

export interface StoryThreadTool extends BaseTool {
  origin: Thread;
  primaryKey: KeyTool;
}
