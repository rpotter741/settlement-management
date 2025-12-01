import { UUID } from '../index';

/// lol maybe we'll see if this gets used

export interface Tag {
  id: string;
  name: string;
  baseWeight: number; // Default weight before any modifiers
  currentWeight: number; // Active weight for event recommendation
  coolDown: number; // Number of turns before weight recovers
  recoveryRate: number; // How much weight is restored per turn
  synergies: Record<string, number>; // { tagName: weightBoost }
  dependencies: Record<string, number>; // { tagName: weightDecay }
  events: string[]; // List of event IDs using this tag
  description?: string;
}
