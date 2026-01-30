import { BaseTool, UUID, Impact, BuildingCost } from '../index';

export type UpgradeTypes = 'building' | 'settlement' | 'leadership';

export interface UpgradeNode extends BaseTool {
  type: UpgradeTypes;
  upgradeId: UUID;
  previousId?: UUID; // Optional for the root node
  nextIds?: UUID[]; // Allows for branching upgrade paths if needed
  cost?: BuildingCost; //optional on non-building upgrades
  impacts: Impact[];
  description?: string;
  logic?: any; // placeholder for unique logic to affect the game state
}

export interface UpgradeTree extends BaseTool {
  root: UUID;
  nodes: Record<UUID, UpgradeNode>;
}
