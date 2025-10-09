import {
  UUID,
  Timestamp,
  ContentType,
  EventSeverity,
  GenericObject,
} from './index';

export type Genre =
  | 'Agnostic'
  | 'Fantasy'
  | 'Sci-Fi'
  | 'Horror'
  | 'Mystery'
  | 'Historical'
  | 'Western'
  | 'Modern'
  | 'Other';

export type SubModelType =
  | 'politics'
  | 'history'
  | 'geography'
  | 'relationships'
  | 'custom';

export interface GlossaryNode {
  id: UUID;
  name: string;
  fileType: 'section' | 'detail';
  entryType: GlossaryEntryType;
  parentId: UUID | null;
  children?: GlossaryNode[];
  parent?: GlossaryNode | null;
  glossaryId: UUID;
  templateId?: UUID | null;
  icon?: {
    name: string;
    color: string;
    backgroundColor: string;
    viewBox: string;
    path: string;
    size: number;
  };
  sortIndex?: number;
  flatIndex?: number;
}

export interface BaseEntry {
  refId?: UUID; // unique identifier for the entry, shared across versions
  id: UUID; // unique identifier for the entry in the glossary
  version?: number; // version number for optimistic updates
  contentType?: ContentType; // type of content (e.g., 'html', 'markdown', 'json')
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: UUID; // user ID of the creator
  forkedBy?: UUID; // user ID of the user who forked this entry
  collaborators?: UUID[]; // list of user IDs who can edit this entry
  editors?: UUID[]; // list of user IDs who can edit this entry
  subType?: string; // sub-type of the entry, e.g., 'note', 'event', 'person'
  name: string;
  description?: {
    markdown?: string;
    string?: string;
  };
  dataString?: string; // stringified JSON for compatibility with older versions
  tags?: string[];
}

export interface GlossarySection extends BaseEntry {
  entryType: GlossaryEntryType;
  subSections?: string[]; // list of sub-sections or categories within the entry
  geography?: GlossaryGeography;
  politics?: GlossaryPolitics;
  history?: GlossaryHistory;
  relationships?: GlossaryRelationships;
  customTabIds?: string[]; // list of custom tab IDs for additional data
  custom?: GenericObject; // custom fields for additional data
  integrationState?: GenericObject; // state for integrations
  backlinksFrom: UUID[];
  backlinksTo: UUID[];
}

export interface GlossaryCustom {
  refId?: UUID;
  id: UUID;
  customTabId: UUID;
  version?: number;
  updatedAt?: Timestamp;
  groups?: string[];
  customFields?: GenericObject;
}

export interface GlossaryGeography {
  refId?: UUID;
  id: UUID;
  version?: number;
  updatedAt?: Timestamp;
  climates?: ClimateType[];
  terrain?: TerrainType[];
  regions?: UUID[]; // list of region IDs
  landmarks?: UUID[]; // list of landmark IDs
  customFields?: GenericObject; // custom fields for additional data
}

export interface GlossaryPolitics {
  refId?: UUID;
  id: UUID;
  version?: number;
  updatedAt?: Timestamp;
  nations?: UUID[]; // list of nation IDs
  settlements?: UUID[]; // list of settlement IDs
  factions?: UUID[]; // list of faction IDs
  locations?: UUID[]; // list of location IDs
  resources?: GenericObject; // resources related to politics
  population?: GenericObject; // population data related to politics
  economy?: GenericObject; // economic data related to politics
  cultures?: GenericObject; // cultural data related to politics
  customFields?: GenericObject; // custom fields for additional data
}

export interface GlossaryRelationships {
  refId?: UUID;
  id: UUID;
  version?: number;
  updatedAt?: Timestamp;
  allies?: UUID[]; // list of ally IDs
  enemies?: UUID[]; // list of enemy IDs
  relationships?: GenericObject; // relationships data
  notoriety?: GenericObject; // notoriety data
  influence?: GenericObject; // influence data
  customFields?: GenericObject; // custom fields for additional data
}

export interface GlossaryHistory {
  refId?: UUID;
  id: UUID;
  version?: number;
  updatedAt?: Timestamp;
  events?: UUID[]; // list of event IDs
  flags?: GenericObject; // flags related to history
  history?: GenericObject; // historical data
  customFields?: GenericObject; // custom fields for additional data
  historyDataString?: string; // stringified JSON for compatibility with older versions
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

export interface LocationEntry extends BaseEntry {
  locationType: LocationType;
  regions: UUID[];
  occupants?: UUID[];
  nearbyFeatures?: Record<string, number>; //id & distance
  events?: UUID[];
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
  | GlossarySection
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
  | 'note';

const glossaryEntryTypeOptions: GlossaryEntryType[] = [
  'continent',
  'territory',
  'domain',
  'province',
  'landmark',
  'settlement',
  'faction',
  'location',
  'person',
  'event',
  'note',
];

export { glossaryEntryTypeOptions };

export interface Glossary {
  id: UUID;
  name: string;
  description: {
    markdown: string;
    string: string;
  };
  genre: Genre;
  subGenre: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: UUID;
  contentType: ContentType;
  GlossaryNode: GlossaryNode[] | null;
}
