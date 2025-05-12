import { UUID, Timestamp, ContentType } from './index';

export interface BaseEntry {
  id: UUID;
  refID: UUID;
  name: string;
  description: string;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  contentType: ContentType;
  createdBy: UUID;
}

export interface RegionEntry extends BaseEntry {
  climate:
    | 'tropical'
    | 'arid'
    | 'temperate'
    | 'polar'
    | 'subtropical'
    | 'mountainous';
  terrain:
    | 'forest'
    | 'mountain'
    | 'desert'
    | 'swamp'
    | 'plains'
    | 'hills'
    | 'tundra';
  factions: UUID[];
  population: number | string;
  notableLocations: UUID[];
  resources?: UUID[];
}

export type GeographicEntryType =
  | 'forest'
  | 'mountain'
  | 'river'
  | 'lake'
  | 'ocean'
  | 'desert'
  | 'swamp'
  | 'cave'
  | 'hill'
  | 'plain'
  | 'valley'
  | 'plateau'
  | 'island'
  | 'archipelago'
  | 'peninsula'
  | 'bay'
  | 'gulf'
  | 'fjord';

export interface GeographicEntry extends BaseEntry {
  type: GeographicEntryType;
  region: UUID[];
  climate:
    | 'tropical'
    | 'arid'
    | 'temperate'
    | 'polar'
    | 'subtropical'
    | 'mountainous';
  terrain:
    | 'forest'
    | 'mountain'
    | 'desert'
    | 'swamp'
    | 'plains'
    | 'hills'
    | 'tundra';
  eventLog: UUID[];
}

export type POIType =
  | 'ruin'
  | 'temple'
  | 'cave'
  | 'dungeon'
  | 'fortress'
  | 'castle'
  | 'tower'
  | 'shrine'
  | 'monument'
  | 'mine'
  | 'village'
  | 'town'
  | 'city'
  | 'capital'
  | 'outpost';

export interface POIEntry extends BaseEntry {
  type: POIType;
  region: UUID[];
  currentOccupants?: UUID[];
  nearbyFeatures?: UUID[];
}

export interface PersonEntry extends BaseEntry {
  occupation: string;
  title: string;
  traits: string[];
  faction: UUID;
  location: UUID;
  relationships: { personId: UUID; relationship: string }[];
  notoriety?:
    | 'unknown'
    | 'local'
    | 'regional'
    | 'national'
    | 'international'
    | 'global'
    | 'cosmic'
    | 'universal';
}

export type GlossaryEntry =
  | RegionEntry
  | GeographicEntry
  | POIEntry
  | PersonEntry;

export type GlossaryEntryType = 'region' | 'geographic' | 'poi' | 'person';
