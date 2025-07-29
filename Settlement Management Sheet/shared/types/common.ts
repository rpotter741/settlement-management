import {
  GlossaryEntryType,
  APT,
  Action,
  Attribute,
  Category,
  BuildingTool,
  KeyTool,
  KitTool,
  ListenerPack,
  SettlementTool,
  StoryThreadTool,
  TradeHubTool,
  UpgradeTree,
  StatusTool,
} from './index';

export type UUID = string;
export type Timestamp = string; // ISO 8601 format
export type ContentType = 'OFFICIAL' | 'CUSTOM';
export type GenericObject = { [key: string]: unknown };
export type ToolName =
  | 'apt'
  | 'action'
  | 'attribute'
  | 'building'
  | 'category'
  | 'event'
  | 'kit'
  | 'listener'
  | 'settlementType'
  | 'settlement'
  | 'gameStatus'
  | 'storyThread'
  | 'tradeHub'
  | 'upgrade';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type GameStatus = 'Weather' | 'Morale' | 'Settlement';
export type GameStatusMode = 'Simple' | 'Advanced';
export type EventSeverity =
  | 'Trivial'
  | 'Minor'
  | 'Notable'
  | 'Significant'
  | 'Major';

export type ReplacementTuple = Partial<
  Record<Exclude<GlossaryEntryType, null>, string[]>
>;

export type FlavorText = Partial<
  Record<
    EventSeverity,
    {
      description: string;
      replacements?: ReplacementTuple;
      links?: UUID[];
    }
  >
>;

export type ImpactSystem =
  | 'Abstract Progress Tracker'
  | 'Settlement'
  | 'Category'
  | 'Attribute'
  | 'Building';

export type ImpactKey =
  | 'Current'
  | 'Max'
  | 'Bonus'
  | 'Add Attribute'
  | 'Remove Attribute';

export interface Impact {
  system: ImpactSystem;
  target: string;
  key: ImpactKey;
  value: number | string;
}

export interface BaseTool {
  id: UUID;
  refId: UUID;
  name: string;
  description?: string;
  tags?: string[];
  isValid: boolean;
  status: ContentStatus;
  contentType: ContentType;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
}

export interface Icon {
  d: string;
  name: string;
  viewBox: string;
  color?: string;
  backgroundColor?: string;
}

export interface BasePerLevel {
  base: number;
  perLevel: number;
}
export interface Balance {
  max: BasePerLevel;
  cost: BasePerLevel;
  health: BasePerLevel;
}

export interface Threshold {
  name: string;
  max: number;
}

export interface Thresholds {
  data: Record<UUID, Threshold>;
  order: UUID[];
}

export interface SPC {
  name: string;
  value: number;
}

export interface SPCs {
  data: Record<UUID, SPC>;
  order: UUID[];
}

export interface Dependency {
  name: string;
  thresholds: Thresholds;
}

export interface Dependencies {
  data: Record<UUID, Dependency>;
  order: UUID[];
  refIds: UUID[];
}

export type Tool =
  | APT
  | Action
  | Attribute
  | BuildingTool
  | Category
  | KeyTool
  | KitTool
  | ListenerPack
  | SettlementTool
  | StatusTool
  | StoryThreadTool
  | TradeHubTool
  | UpgradeTree;
