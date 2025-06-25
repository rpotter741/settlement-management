import { GlossaryEntryArrayKeys } from '@/app/types/GlossaryTypes.js';
import {
  ContinentEntry,
  DomainEntry,
  EventEntry,
  FactionEntry,
  LandmarkEntry,
  LocationEntry,
  NoteEntry,
  PersonEntry,
  ProvinceEntry,
  SettlementEntry,
  TerritoryEntry,
} from 'types/index.js';

interface PropertyArrayDescriptors<T extends string> {
  multiple: boolean;
  keypath: T;
  label: string;
  hasPrimary?: boolean;
}

const definePropertyArrayMap = <T extends string>(
  arr: PropertyArrayDescriptors<T>[]
): PropertyArrayDescriptors<T>[] => arr;

const continentPropertyArrayMap = definePropertyArrayMap<keyof ContinentEntry>([
  {
    multiple: true,
    keypath: 'nations',
    label: 'Nations',
  },
  {
    multiple: true,
    keypath: 'regions',
    label: 'Regions',
  },
  {
    multiple: true,
    keypath: 'notableLocations',
    label: 'Notable Locations',
  },
  {
    multiple: true,
    keypath: 'resources',
    label: 'Resources',
  },
  {
    multiple: false,
    keypath: 'population',
    label: 'Population',
  },
  {
    multiple: true,
    keypath: 'climate',
    label: 'Climate',
  },
  {
    multiple: true,
    keypath: 'terrain',
    label: 'Terrain',
  },
  {
    multiple: true,
    keypath: 'eventLog',
    label: 'Event Log',
  },
]);

const territoryPropertyArrayMap = definePropertyArrayMap<keyof TerritoryEntry>([
  {
    multiple: true,
    keypath: 'climates',
    label: 'Climates',
    hasPrimary: true,
  },
  {
    multiple: true,
    keypath: 'terrain',
    label: 'Terrain',
    hasPrimary: false,
  },
  {
    multiple: true,
    keypath: 'nations',
    label: 'Nations',
    hasPrimary: true,
  },
  {
    multiple: true,
    keypath: 'factions',
    label: 'Factions',
    hasPrimary: false,
  },
  {
    multiple: false,
    keypath: 'population',
    label: 'Population',
  },
  {
    multiple: true,
    keypath: 'locations',
    label: 'Locations',
  },
  {
    multiple: true,
    keypath: 'landmarks',
    label: 'Landmarks',
  },
  {
    multiple: true,
    keypath: 'resources',
    label: 'Resources',
  },
]);

const domainPropertyArrayMap = definePropertyArrayMap<keyof DomainEntry>([
  {
    multiple: true,
    keypath: 'continent',
    label: 'Continents',
  },
  {
    multiple: true,
    keypath: 'regions',
    label: 'Regions',
  },
  {
    multiple: true,
    keypath: 'capital',
    label: 'Capital',
  },
  {
    multiple: false,
    keypath: 'population',
    label: 'Population',
  },
  {
    multiple: false,
    keypath: 'governmentType',
    label: 'Government Type',
  },
  {
    multiple: false,
    keypath: 'economy',
    label: 'Economy',
  },
  {
    multiple: false,
    keypath: 'culture',
    label: 'Culture',
  },
  {
    multiple: true,
    keypath: 'languages',
    label: 'Languages',
  },
  {
    multiple: true,
    keypath: 'notableFigures',
    label: 'Notable Figures',
  },
  {
    multiple: true,
    keypath: 'notableEvents',
    label: 'Notable Events',
  },
  {
    multiple: true,
    keypath: 'resources',
    label: 'Resources',
  },
  {
    multiple: true,
    keypath: 'flags',
    label: 'Flags',
  },
  {
    multiple: false,
    keypath: 'history',
    label: 'History',
  },
  // {
  //   multiple: true,
  //   keypath: 'relationships',
  //   label: 'Relationships',
  // },
  {
    multiple: true,
    keypath: 'notableLocations',
    label: 'Notable Locations',
  },
  {
    multiple: true,
    keypath: 'geography',
    label: 'Geography (Landmarks)',
  },
]);

const provincePropertyArrayMap = definePropertyArrayMap<keyof ProvinceEntry>([
  {
    multiple: true,
    keypath: 'nations',
    label: 'Nations',
  },
  {
    multiple: true,
    keypath: 'terrain',
    label: 'Terrain',
  },
  {
    multiple: true,
    keypath: 'locations',
    label: 'Locations',
  },
  {
    multiple: true,
    keypath: 'landmarks',
    label: 'Landmarks',
  },
  {
    multiple: true,
    keypath: 'people',
    label: 'People',
  },
  {
    multiple: true,
    keypath: 'eventLog',
    label: 'Event Log',
  },
  {
    multiple: true,
    keypath: 'resources',
    label: 'Resources',
  },
  {
    multiple: false,
    keypath: 'population',
    label: 'Population',
  },
]);

const landmarkPropertyArrayMap = definePropertyArrayMap<keyof LandmarkEntry>([
  {
    multiple: false,
    keypath: 'climates',
    label: 'Climate',
  },
  {
    multiple: true,
    keypath: 'regions',
    label: 'Region',
    hasPrimary: true,
  },
  {
    multiple: false,
    keypath: 'type',
    label: 'Type',
  },
]);

const settlementPropertyArrayMap = definePropertyArrayMap<
  keyof SettlementEntry
>([
  {
    multiple: true,
    keypath: 'nation',
    label: 'Nation',
  },
  {
    multiple: true,
    keypath: 'region',
    label: 'Region',
  },
  {
    multiple: false,
    keypath: 'population',
    label: 'Population',
  },
  {
    multiple: false,
    keypath: 'type',
    label: 'Type',
  },
  {
    multiple: false,
    keypath: 'economy',
    label: 'Economy',
  },
  {
    multiple: false,
    keypath: 'government',
    label: 'Government',
  },
  {
    multiple: false,
    keypath: 'culture',
    label: 'Culture',
  },
  {
    multiple: true,
    keypath: 'notableFigures',
    label: 'Notable Figures',
  },
  {
    multiple: true,
    keypath: 'notableEvents',
    label: 'Notable Events',
  },
  {
    multiple: true,
    keypath: 'notableLocations',
    label: 'Notable Locations',
  },
  {
    multiple: false,
    keypath: 'history',
    label: 'History',
  },
  {
    multiple: true,
    keypath: 'relationships',
    label: 'Relationships',
  },
]);

const factionPropertyArrayMap = definePropertyArrayMap<keyof FactionEntry>([
  {
    multiple: true,
    keypath: 'leader',
    label: 'Leader',
  },
  // {
  //   multiple: true,
  //   keypath: 'members',
  //   label: 'Members',
  // },
  {
    multiple: true,
    keypath: 'allies',
    label: 'Allies',
  },
  {
    multiple: true,
    keypath: 'enemies',
    label: 'Enemies',
  },
  // {
  //   multiple: true,
  //   keypath: 'nations',
  //   label: 'Nations',
  // },
  // {
  //   multiple: true,
  //   keypath: 'regions',
  //   label: 'Regions',
  // },
  {
    multiple: true,
    keypath: 'homeBase',
    label: 'Home Base',
  },
  // {
  //   multiple: true,
  //   keypath: 'relationships',
  //   label: 'Relationships',
  // },
]);

const personPropertyArrayMap = definePropertyArrayMap<keyof PersonEntry>([
  {
    multiple: false,
    keypath: 'occupation',
    label: 'Occupation',
  },
  {
    multiple: false,
    keypath: 'title',
    label: 'Title',
  },
  {
    multiple: true,
    keypath: 'traits',
    label: 'Traits',
  },
  {
    multiple: true,
    keypath: 'faction',
    label: 'Faction',
  },
  {
    multiple: true,
    keypath: 'location',
    label: 'Location',
  },
  // {
  //   multiple: true,
  //   keypath: 'relationships',
  //   label: 'Relationships',
  // },
  // {
  //   multiple: false,
  //   keypath: 'notoriety',
  //   label: 'Notoriety Level',
  // },
]);

const locationPropertyArrayMap = definePropertyArrayMap<keyof LocationEntry>([
  {
    multiple: false,
    keypath: 'type',
    label: 'Type',
  },
  {
    multiple: false,
    keypath: 'region',
    label: 'Region',
    hasPrimary: true,
  },
  {
    multiple: true,
    keypath: 'currentOccupants',
    label: 'Current Occupants',
  },
  // {
  //   multiple: true,
  //   keypath: 'nearbyFeatures',
  //   label: 'Nearby Features',
  // },
  {
    multiple: true,
    keypath: 'resources',
    label: 'Resources',
  },
  {
    multiple: true,
    keypath: 'eventLog',
    label: 'Event Log',
  },
]);

const notePropertyArrayMap = definePropertyArrayMap<keyof NoteEntry>([
  {
    multiple: false,
    keypath: 'type',
    label: 'Type',
  },
  {
    multiple: false,
    keypath: 'priority',
    label: 'Priority',
  },
  {
    multiple: false,
    keypath: 'dueDate',
    label: 'Due Date',
  },
  // {
  //   multiple: true,
  //   keypath: 'relatedEntries',
  //   label: 'Related Entries',
  // },
  {
    multiple: true,
    keypath: 'tags',
    label: 'Tags',
  },
  // {
  //   multiple: false,
  //   keypath: 'isArchived',
  //   label: 'Is Archived',
  // },
  // {
  //   multiple: false,
  //   keypath: 'isPinned',
  //   label: 'Is Pinned',
  // },
  // {
  //   multiple: false,
  //   keypath: 'isShared',
  //   label: 'Is Shared',
  // },
  {
    multiple: true,
    keypath: 'sharedWith',
    label: 'Shared With',
  },
  // {
  //   multiple: true,
  //   keypath: 'attachments',
  //   label: 'Attachments',
  // },
]);

const eventPropertyArrayMap = definePropertyArrayMap<keyof EventEntry>([
  {
    multiple: false,
    keypath: 'significance',
    label: 'Significance',
  },
  {
    multiple: false,
    keypath: 'gameDate',
    label: 'Game Date',
  },
  {
    multiple: false,
    keypath: 'frequency',
    label: 'Frequency',
  },
  {
    multiple: true,
    keypath: 'location',
    label: 'Location',
  },
  {
    multiple: true,
    keypath: 'relatedEntries',
    label: 'Related Entries',
  },
  {
    multiple: true,
    keypath: 'tags',
    label: 'Tags',
  },
]);

type GlossaryEntryMap = {
  continent: ContinentEntry;
  territory: TerritoryEntry;
  domain: DomainEntry;
  province: ProvinceEntry;
  landmark: LandmarkEntry;
  settlement: SettlementEntry;
  faction: FactionEntry;
  person: PersonEntry;
  location: LocationEntry;
  note: NoteEntry;
  event: EventEntry;
};

type PropertyArrayMap = {
  [K in keyof GlossaryEntryMap]: PropertyArrayDescriptors<
    Extract<keyof GlossaryEntryMap[K], string>
  >[];
};

const propertyArrayMap: PropertyArrayMap = {
  continent: continentPropertyArrayMap,
  territory: territoryPropertyArrayMap,
  domain: domainPropertyArrayMap,
  province: provincePropertyArrayMap,
  landmark: landmarkPropertyArrayMap,
  settlement: settlementPropertyArrayMap,
  faction: factionPropertyArrayMap,
  person: personPropertyArrayMap,
  location: locationPropertyArrayMap,
  note: notePropertyArrayMap,
  event: eventPropertyArrayMap,
};

export default propertyArrayMap;
