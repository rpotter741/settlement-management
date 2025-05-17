import {
  BaseTool,
  Condition,
  ReplacementTuple,
  FlavorText,
  KeyTool,
  UUID,
  Impact,
} from '../index';

export type EventType = 'Active' | 'Immediate' | 'Passive' | 'Indefinite';

export interface EventPhase {
  id: UUID;
  name: string;
  description?: string;
  flavorText?: FlavorText;
  type: EventType;
  impacts: Impact[];
  resolutions: EventResolution[];
  nextPhaseId: UUID | null;
  duration?: number | null; // for passive events
  productivity?: number | null; // for active events
  exposedKeys?: UUID[]; // keys that are exposed in this phase
  isTerminal?: boolean; // wraps up the thread
}

export interface EventResolution {
  id: UUID;
  name: string;
  description?: string;
  impacts: Impact[];
  keys: UUID[];
  branches?: Branch[];
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
  narrativeWeight?:
    | 'TRIVIAL'
    | 'MINOR'
    | 'MODERATE'
    | 'MAJOR'
    | 'CRITICAL'
    | null;
  phases: EventPhase[];
  replacement?: ReplacementTuple;
  links?: UUID[];
  entryPhaseId: UUID;
}

export interface StoryThreadTool extends BaseTool {
  origin: Thread;
  primaryKey: KeyTool;
}
