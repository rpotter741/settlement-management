import { BaseTool, UUID } from '../index';

export interface SettlementStats {
  level: number;
  health: number;
  currency: number;
  calendar: UUID;
}

export interface PopulationStats {
  dm: UUID[];
  players: UUID[];
  residents: UUID[];
  emissaries: UUID[];
}

export interface AttributeStats {
  refId: UUID;
  id: UUID;
  name: string;
  current: number;
  max: number;
  bonus: number;
  positive: boolean;
}

export interface CategoryStats {
  refId: UUID;
  attributes: AttributeStats[];
  current: number;
  bonus: number;
}

export interface SettlementTool extends BaseTool {
  stats: SettlementStats;
  population: PopulationStats;
  categories: CategoryStats[];
  buildings: UUID[];
}
