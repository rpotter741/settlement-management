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

type SectionTypes =
  | 'Geography'
  | 'Political'
  | 'Geopolitical'
  | 'Government'
  | 'Economy'
  | 'Culture'
  | 'History'
  | 'Relationships'
  | 'Roster'
  | 'Profession'
  | 'Background'
  | 'Details'
  | 'Related'
  | 'Notes';

export interface PropertyArrayDescriptors<T extends string> {
  multiple: boolean;
  keypath: T;
  label: string;
  hasPrimary?: boolean;
  section?: SectionTypes;
  component?: React.ComponentType<any>;
}

export interface PropertySectionDescriptors<T extends string> {
  name: SectionTypes;
  children: PropertyArrayDescriptors<T>[];
}

const definePropertyArrayMap = <T extends string>(
  arr: PropertySectionDescriptors<T>[]
): PropertySectionDescriptors<T>[] => arr;

import continentPropertyArrayMap from './fantasy/continent.js';

const territoryPropertyArrayMap = definePropertyArrayMap<keyof TerritoryEntry>([
  {
    name: 'Geography',
    children: [
      {
        multiple: false,
        keypath: 'climates',
        label: 'Climates',
        hasPrimary: true,
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
    ],
  },
  {
    name: 'Political',
    children: [
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
        keypath: 'resources',
        label: 'Resources',
      },
    ],
  },
]);

const domainPropertyArrayMap = definePropertyArrayMap<keyof DomainEntry>([
  {
    name: 'Government',
    children: [
      {
        multiple: true,
        keypath: 'capital',
        label: 'Capital',
      },
      {
        multiple: false,
        keypath: 'governmentType',
        label: 'Government Type',
      },
      {
        multiple: false,
        keypath: 'population',
        label: 'Population',
      },
      {
        multiple: true,
        keypath: 'notableFigures',
        label: 'Notable Figures',
      },
      {
        multiple: false,
        keypath: 'culture',
        label: 'Culture',
      },
      {
        multiple: true,
        keypath: 'locations',
        label: 'Locations',
      },
      {
        multiple: true,
        keypath: 'languages',
        label: 'Languages',
      },
      {
        multiple: false,
        keypath: 'economy',
        label: 'Economy',
      },
      {
        multiple: true,
        keypath: 'resources',
        label: 'Resources',
      },
    ],
  },
  {
    name: 'Geography',
    children: [
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
        keypath: 'geography',
        label: 'Landmarks',
      },
    ],
  },

  {
    name: 'History',
    children: [
      {
        multiple: false,
        keypath: 'history',
        label: 'History',
      },

      {
        multiple: true,
        keypath: 'notableEvents',
        label: 'Notable Events',
      },
      {
        multiple: true,
        keypath: 'flags',
        label: 'Flags',
      },
    ],
  },

  // {
  //   multiple: true,
  //   keypath: 'relationships',
  //   label: 'Relationships',
  // },
]);

const provincePropertyArrayMap = definePropertyArrayMap<keyof ProvinceEntry>([
  {
    name: 'Geography',
    children: [
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
    ],
  },
  {
    name: 'Political',
    children: [
      {
        multiple: true,
        keypath: 'nations',
        label: 'Nations',
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
        keypath: 'people',
        label: 'People',
      },
    ],
  },
  {
    name: 'History',
    children: [
      {
        multiple: true,
        keypath: 'eventLog',
        label: 'Event Log',
      },
    ],
  },
]);

const landmarkPropertyArrayMap = definePropertyArrayMap<keyof LandmarkEntry>([
  {
    name: 'Geography',
    children: [
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
        keypath: 'geographicType',
        label: 'Type',
      },
    ],
  },
  {
    name: 'Notes',
    children: [
      {
        multiple: false,
        keypath: 'notes',
        label: 'Notes',
      },
    ],
  },
]);

const settlementPropertyArrayMap = definePropertyArrayMap<
  keyof SettlementEntry
>([
  {
    name: 'Geopolitical',
    children: [
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
    ],
  },
  {
    name: 'Government',
    children: [
      {
        multiple: false,
        keypath: 'government',
        label: 'Government',
      },
      {
        multiple: false,
        keypath: 'type',
        label: 'Settlement Type',
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
        keypath: 'people',
        label: 'Notable Figures',
      },
    ],
  },
  {
    name: 'History',
    children: [
      {
        multiple: true,
        keypath: 'events',
        label: 'Notable Events',
      },
      {
        multiple: true,
        keypath: 'locations',
        label: 'Notable Locations',
      },
      {
        multiple: false,
        keypath: 'history',
        label: 'History',
      },
    ],
  },
  // {
  //   multiple: true,
  //   keypath: 'relationships',
  //   label: 'Relationships',
  // },
]);

const factionPropertyArrayMap = definePropertyArrayMap<keyof FactionEntry>([
  {
    name: 'Roster',
    children: [
      {
        multiple: true,
        keypath: 'leader',
        label: 'Leader',
      },
      {
        multiple: true,
        keypath: 'homeBase',
        label: 'Home Base',
      },
      {
        multiple: true,
        keypath: 'members',
        label: 'Members',
      },
    ],
  },
  {
    name: 'Geopolitical',
    children: [
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
    ],
  },
  {
    name: 'Relationships',
    children: [
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
      //   keypath: 'relationships',
      //   label: 'Relationships',
      // },
    ],
  },
]);

const personPropertyArrayMap = definePropertyArrayMap<keyof PersonEntry>([
  {
    name: 'Profession',
    children: [
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
    ],
  },
  {
    name: 'Background',
    children: [
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
        multiple: false,
        keypath: 'history',
        label: 'History',
      },
    ],
  },
  {
    name: 'Details',
    children: [
      {
        multiple: true,
        keypath: 'location',
        label: 'Location',
      },
      {
        multiple: false,
        keypath: 'appearance',
        label: 'Appearance',
      },

      {
        multiple: false,
        keypath: 'events',
        label: 'Events',
      },
    ],
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
    name: 'Details',
    children: [
      {
        multiple: false,
        keypath: 'locationType',
        label: 'Type',
      },
      {
        multiple: true,
        keypath: 'currentOccupants',
        label: 'Current Occupants',
      },
      {
        multiple: true,
        keypath: 'resources',
        label: 'Resources',
      },
    ],
  },
  // {
  //   multiple: true,
  //   keypath: 'nearbyFeatures',
  //   label: 'Nearby Features',
  // },
  {
    name: 'History',
    children: [
      {
        multiple: true,
        keypath: 'eventLog',
        label: 'Event Log',
      },
    ],
  },
]);

const notePropertyArrayMap = definePropertyArrayMap<keyof NoteEntry>([
  {
    name: 'Details',
    children: [
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
      {
        multiple: true,
        keypath: 'sharedWith',
        label: 'Shared With',
      },
    ],
  },
  // {
  //   multiple: true,
  //   keypath: 'relatedEntries',
  //   label: 'Related Entries',
  // },
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

  // {
  //   multiple: true,
  //   keypath: 'attachments',
  //   label: 'Attachments',
  // },
]);

const eventPropertyArrayMap = definePropertyArrayMap<keyof EventEntry>([
  {
    name: 'Details',
    children: [
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
        multiple: true,
        keypath: 'location',
        label: 'Location',
      },
      {
        multiple: false,
        keypath: 'frequency',
        label: 'Frequency',
      },
    ],
  },
  {
    name: 'Related',
    children: [
      {
        multiple: true,
        keypath: 'relatedEntries',
        label: 'Related Entries',
      },
    ],
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
  [K in keyof GlossaryEntryMap]: PropertySectionDescriptors<
    Extract<keyof GlossaryEntryMap[K], string>
  >[];
};

const propertyArrayMap = {
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
