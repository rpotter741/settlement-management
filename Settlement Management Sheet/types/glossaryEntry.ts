import { UUID, Timestamp, ContentType, EventSeverity } from './index';

export interface GlossaryNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  entryType: GlossaryEntryType | null;
  parentId: string | null;
  children?: GlossaryNode[];
  parent?: GlossaryNode | null;
  glossaryId: UUID;
  icon?: {
    name: string;
    color: string;
    viewBox: string;
    path: string;
    size: number;
  };
  sortIndex?: number;
  flatIndex?: number;
}

export interface BaseEntry {
  id: UUID;
  refID: UUID;
  name: string;
  summary: string;
  description: string | null;
  content: {
    type: 'html' | 'markdown' | 'json';
    body: string;
  };
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  contentType: ContentType;
  createdBy: UUID;
}

export type TerrainType =
  | 'forests'
  | 'mountains'
  | 'deserts'
  | 'swamps'
  | 'plains'
  | 'hills'
  | 'valleys'
  | 'plateaus'
  | 'tundra'
  | 'badlands'
  | 'coastal'
  | 'volcanic'
  | 'glacial'
  | 'taiga';

export const TerrainTypeOptions: TerrainType[] = [
  'forests',
  'mountains',
  'deserts',
  'swamps',
  'plains',
  'hills',
  'valleys',
  'plateaus',
  'tundra',
  'badlands',
  'coastal',
  'volcanic',
  'glacial',
  'taiga',
];

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
  | 'fjord'
  | 'volcano'
  | 'glacier'
  | 'canyon'
  | 'steppe'
  | 'marsh'
  | 'wetland'
  | 'reef'
  | 'delta'
  | 'atoll';

export const geographicEntryTypeOptions: GeographicEntryType[] = [
  'forest',
  'mountain',
  'river',
  'lake',
  'ocean',
  'desert',
  'swamp',
  'cave',
  'hill',
  'plain',
  'valley',
  'glacier',
  'volcano',
  'canyon',
  'island',
  'archipelago',
  'peninsula',
  'bay',
  'gulf',
  'fjord',
  'steppe',
  'marsh',
  'wetland',
  'reef',
  'delta',
  'atoll',
];

export type ClimateType =
  | 'tropical'
  | 'arid'
  | 'temperate'
  | 'polar'
  | 'subtropical'
  | 'continental'
  | 'icecap';

export const ClimateTypeOptions: ClimateType[] = [
  'tropical',
  'arid',
  'temperate',
  'polar',
  'subtropical',
  'continental',
  'icecap',
];

export interface TerritoryEntry extends BaseEntry {
  climate: ClimateType[];
  terrain: TerrainType[];
  nations: UUID[];
  factions: UUID[];
  population: number | string;
  locations: UUID[];
  geographicFeatures: UUID[];
  resources?: string[];
}

export interface ProvinceEntry extends BaseEntry {
  nation: UUID[];
  terrain: TerrainType[];
  locations: UUID[];
  geographicFeatures: UUID[];
  people: UUID[];
  notableEvents?: UUID[];
  resources?: string[];
  population: number | string;
}

export interface LandmarkEntry extends BaseEntry {
  type: GeographicEntryType;
  region: UUID[];
  climate: ClimateType;
  terrain: TerrainType;
  eventLog: UUID[];
}

export interface PersonEntry extends BaseEntry {
  occupation: string;
  title: string;
  traits: string[];
  faction: UUID;
  location: UUID;
  relationships: { id: UUID; type: string; relationship: string }[];
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

export interface ContinentEntry extends BaseEntry {
  nations: UUID[];
  regions: UUID[];
  notableLocations: UUID[];
  resources?: string[];
  population: number | string;
  climate: ClimateType[];
  terrain: GeographicEntryType[];
  eventLog?: UUID[];
}

export interface DomainEntry extends BaseEntry {
  continent: UUID[];
  regions: UUID[];
  capital: UUID;
  population: number | string;
  governmentType: string;
  economy: string;
  culture: string;
  languages: string[];
  notableFigures: UUID[];
  notableEvents?: UUID[];
  resources?: string[];
  flags?: string[]; // URLs or base64 encoded images
  history?: string; // A brief history of the nation
  relationships?: { id: UUID; type: string; relationship: string }[]; // Relationships with other nations or factions
  notableLocations?: UUID[]; // Significant locations within the nation
  geography?: LandmarkEntry[]; // Geographic features within the nation
}

export interface SettlementEntry extends BaseEntry {
  nation: UUID;
  region: UUID;
  population: number | string;
  type: 'hamlet' | 'village' | 'town' | 'city' | 'capital';
  economy: string;
  government: string;
  culture: string;
  notableFigures: UUID[];
  notableEvents?: UUID[];
  notableLocations?: UUID[]; // Significant locations within the settlement
  history?: string; // A brief history of the settlement
  relationships?: { id: UUID; type: string; relationship: string }[];
}

export interface FactionEntry extends BaseEntry {
  leader: UUID;
  members: UUID[];
  allies: UUID[];
  enemies: UUID[];
  nations: UUID[];
  regions: UUID[];
  homeBase: UUID;
  relationships: { id: UUID; type: string; relationship: string }[];
  influence: number;
  notoriety: number;
  cultureTags: string[];
  activeKeys: string[];
  passiveBonuses: Record<string, any>; // flesh out later
}

export type LocationType =
  | 'Ruin'
  | 'Temple'
  | 'Cave'
  | 'Dungeon'
  | 'Fortress'
  | 'Castle'
  | 'Tower'
  | 'Shrine'
  | 'Monument'
  | 'Mine'
  | 'Village'
  | 'Town'
  | 'City'
  | 'Capital'
  | 'Outpost'
  | 'Mountain'
  | 'Hill'
  | 'Glade'
  | 'Graveyard'
  | 'Store'
  | 'Market'
  | 'Library'
  | 'Academy'
  | 'Inn'
  | 'Tavern'
  | 'Farm'
  | 'Port'
  | 'Dock'
  | 'Ship'
  | 'Manor'
  | 'Barracks'
  | 'Watchtower'
  | 'Lighthouse'
  | 'Garden'
  | 'Arena'
  | 'Guildhall'
  | 'Workshop'
  | 'Palace'
  | 'Keep'
  | 'Sanctuary'
  | 'Camp'
  | 'Lumberyard'
  | 'Quarry';

export const LocationTypes: LocationType[] = [
  'Ruin',
  'Temple',
  'Cave',
  'Dungeon',
  'Fortress',
  'Castle',
  'Tower',
  'Shrine',
  'Monument',
  'Mine',
  'Village',
  'Town',
  'City',
  'Capital',
  'Outpost',
  'Mountain',
  'Hill',
  'Glade',
  'Graveyard',
  'Store',
  'Market',
  'Library',
  'Academy',
  'Inn',
  'Tavern',
  'Farm',
  'Port',
  'Dock',
  'Ship',
  'Manor',
  'Barracks',
  'Watchtower',
  'Lighthouse',
  'Garden',
  'Arena',
  'Guildhall',
  'Workshop',
  'Palace',
  'Keep',
  'Sanctuary',
  'Camp',
  'Lumberyard',
  'Quarry',
];

export interface LocationEntry extends BaseEntry {
  type: LocationType;
  region: UUID;
  currentOccupants?: UUID[];
  nearbyFeatures?: Record<string, number>; //id & distance
  resources?: string[];
  eventLog?: UUID[];
}

export interface EventEntry extends BaseEntry {
  significance: EventSeverity;
  gameDate: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  location: UUID | null; // Location of the event, if applicable
  relatedEntries?: UUID[]; // Related entries, such as people, factions, or locations
  tags?: string[]; // Tags for categorization
}

export interface NoteEntry extends BaseEntry {
  type: 'general' | 'task' | 'reminder' | 'idea' | 'reference';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Timestamp | null; // Optional due date for tasks or reminders
  relatedEntries?: { id: string; type: string }[]; // Related entries, such as people, factions, or locations
  tags?: string[]; // Tags for categorization
  isArchived?: boolean; // Flag to indicate if the note is archived
  isPinned?: boolean; // Flag to indicate if the note is pinned for quick access
  isShared?: boolean; // Flag to indicate if the note is shared with others
  sharedWith?: UUID[]; // List of user IDs with whom the note is shared
  attachments?: {
    id: UUID;
    name: string;
    url: string; // URL to the attachment
    type: 'image' | 'document' | 'audio' | 'video' | 'other';
    createdAt: Timestamp;
    createdBy: UUID; // User ID of the creator
  }[]; // List of attachments related to the note
}

export type GlossaryEntry =
  | ContinentEntry
  | TerritoryEntry
  | DomainEntry
  | ProvinceEntry
  | LandmarkEntry
  | FactionEntry
  | SettlementEntry
  | LocationEntry
  | PersonEntry
  | EventEntry
  | NoteEntry;

export type GlossaryEntryType =
  | 'continent'
  | 'territory'
  | 'domain'
  | 'province'
  | 'landmark'
  | 'settlement'
  | 'faction'
  | 'location'
  | 'person'
  | 'event'
  | 'note'
  | null;

export interface Glossary {
  id: UUID;
  name: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: UUID;
  contentType: ContentType;
  GlossaryNode: GlossaryNode[] | null;
}
