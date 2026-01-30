import { BaseTool, UUID, Impact, UpgradeTree } from '../index';

export interface BuildingMetrics {
  health: number;
  maxHealth: number;
  complexity: number; // e.g., 1-10 for repair costs
  repairCost: number;
}

export interface BuildingCost {
  supplies: number;
  currency: number;
  time: number; // Optional, if you ever want to include build time
  requirements?: UUID[]; // Other buildings, attributes, or categories
}

export interface BuildingTool extends BaseTool {
  metrics: BuildingMetrics;
  attributes?: UUID[]; // Optional link to attributes this building influences
  upgradeTree?: UpgradeTree;
  initialCost: BuildingCost;
  impacts: Impact[];
  flavorText?: string;
  dependencies?: UUID[];
}
