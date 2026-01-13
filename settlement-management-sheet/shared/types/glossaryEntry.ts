import { Backlink } from '@/features/SyncWorkspace/SyncWorkspace.js';
import {
  UUID,
  Timestamp,
  ContentType,
  EventSeverity,
  GenericObject,
} from './index.js';

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
  subTypeId: string;
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

interface GlossaryEntryProperty {
  id: UUID;
  name: string;
  value: any;
}

interface GlossaryEntryGroup {
  id: UUID;
  name: string;
  properties: Record<string, GlossaryEntryProperty>;
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
  subTypeId?: string; // sub-type of the entry, e.g., 'note', 'event', 'person'
  groups: Record<string, GlossaryEntryGroup>; // structured content of the entry
  name: string;
  tags?: string[];
}

export interface GlossaryEntry extends BaseEntry {
  entryType: GlossaryEntryType;
  subTypeId: string;
  integrationState?: GenericObject; // state for integrations
  primaryAnchorId: UUID | null;
  secondaryAnchorId: UUID | null;
  primaryAnchorValue: string;
  secondaryAnchorValue: string;
  backlinksFrom: Backlink[];
  backlinksTo: Backlink[];
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
  'Graveyard',
  'Store',
  'Market',
  'Library',
  'Academy',
  'Inn',
  'Tavern',
  'Farm',
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
  'Lumberyard',
  'Quarry',
];

export interface PersonEntry extends BaseEntry {
  occupation: string;
  title: string;
  traits: string[];
  collective: UUID;
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

export type GlossaryEntryType =
  | 'continent'
  | 'region'
  | 'nation'
  | 'territory'
  | 'landmark'
  | 'settlement'
  | 'district'
  | 'collective'
  | 'location'
  | 'person'
  | 'event'
  | 'lore'
  | 'item'
  | 'folder';

const glossaryEntryTypeOptions: GlossaryEntryType[] = [
  'continent',
  'region',
  'nation',
  'territory',
  'landmark',
  'settlement',
  'district',
  'collective',
  'location',
  'person',
  'event',
  'lore',
  'item',
];

export { glossaryEntryTypeOptions };

export const TYPE_BITMASKS: Record<GlossaryEntryType, number> =
  glossaryEntryTypeOptions.reduce((acc, type, index) => {
    acc[type] = 1 << index;
    return acc;
  }, {} as Record<GlossaryEntryType, number>);

export const typeAcceptMap = {
  continent: {
    region: TYPE_BITMASKS.region,
    nation: TYPE_BITMASKS.nation,
    territory: TYPE_BITMASKS.territory,
    landmark: TYPE_BITMASKS.landmark,
    settlement: TYPE_BITMASKS.settlement,
    district: TYPE_BITMASKS.district,
    collective: TYPE_BITMASKS.collective,
    location: TYPE_BITMASKS.location,
    person: TYPE_BITMASKS.person,
    event: TYPE_BITMASKS.event,
    lore: TYPE_BITMASKS.lore,
    item: TYPE_BITMASKS.item,
  },
  region: {
    nation: TYPE_BITMASKS.nation,
    territory: TYPE_BITMASKS.territory,
    landmark: TYPE_BITMASKS.landmark,
    settlement: TYPE_BITMASKS.settlement,
    district: TYPE_BITMASKS.district,
    collective: TYPE_BITMASKS.collective,
    location: TYPE_BITMASKS.location,
    person: TYPE_BITMASKS.person,
    event: TYPE_BITMASKS.event,
    lore: TYPE_BITMASKS.lore,
    item: TYPE_BITMASKS.item,
  },
  nation: {
    territory: TYPE_BITMASKS.territory,
    landmark: TYPE_BITMASKS.landmark,
    settlement: TYPE_BITMASKS.settlement,
    district: TYPE_BITMASKS.district,
    collective: TYPE_BITMASKS.collective,
    location: TYPE_BITMASKS.location,
    person: TYPE_BITMASKS.person,
    event: TYPE_BITMASKS.event,
    lore: TYPE_BITMASKS.lore,
    item: TYPE_BITMASKS.item,
  },
  territory: {
    landmark: TYPE_BITMASKS.landmark,
    settlement: TYPE_BITMASKS.settlement,
    district: TYPE_BITMASKS.district,
    collective: TYPE_BITMASKS.collective,
    location: TYPE_BITMASKS.location,
    person: TYPE_BITMASKS.person,
    event: TYPE_BITMASKS.event,
    lore: TYPE_BITMASKS.lore,
    item: TYPE_BITMASKS.item,
  },
  landmark: {
    settlement: TYPE_BITMASKS.settlement,
    district: TYPE_BITMASKS.district,
    collective: TYPE_BITMASKS.collective,
    location: TYPE_BITMASKS.location,
    person: TYPE_BITMASKS.person,
    event: TYPE_BITMASKS.event,
    lore: TYPE_BITMASKS.lore,
    item: TYPE_BITMASKS.item,
  },
  settlement: {
    district: TYPE_BITMASKS.district,
    collective: TYPE_BITMASKS.collective,
    location: TYPE_BITMASKS.location,
    person: TYPE_BITMASKS.person,
    event: TYPE_BITMASKS.event,
    lore: TYPE_BITMASKS.lore,
    item: TYPE_BITMASKS.item,
  },
  district: {
    collective: TYPE_BITMASKS.collective,
    location: TYPE_BITMASKS.location,
    person: TYPE_BITMASKS.person,
    event: TYPE_BITMASKS.event,
    lore: TYPE_BITMASKS.lore,
    item: TYPE_BITMASKS.item,
  },
  collective: {
    location: TYPE_BITMASKS.location,
    person: TYPE_BITMASKS.person,
    event: TYPE_BITMASKS.event,
    lore: TYPE_BITMASKS.lore,
    item: TYPE_BITMASKS.item,
  },
  location: 0,
  person: 0,
  event: 0,
  lore: 0,
  item: 0,
};

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
