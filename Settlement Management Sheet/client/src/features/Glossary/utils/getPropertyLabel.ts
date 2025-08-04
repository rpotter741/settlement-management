import { Genre } from '@/components/shared/Metadata/GenreSelect.js';

export type SubSectionTypes =
  | 'system'
  | 'geography'
  | 'politics'
  | 'relationships'
  | 'history'
  | 'custom';

export const genrePropertyLabelDefaults: Record<
  Genre,
  Record<SubSectionTypes, Record<string, string>>
> = {
  Fantasy: {
    system: {
      glossary: 'Tome',
      continent: 'Continent',
      territory: 'Territory',
      domain: 'Domain',
      province: 'Province',
      landmark: 'Landmark',
      settlement: 'Settlement',
      faction: 'Faction',
      location: 'Location',
      person: 'Person',
      event: 'Event',
      note: 'Note',
    },
    geography: {
      'Geography Name': 'Geography',
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      landmarks: 'Landmarks',
    },
    politics: {
      'Politics Name': 'Political',
      nations: 'Nations',
      settlements: 'Settlements',
      factions: 'Factions',
      locations: 'Locations',
      resources: 'Resources',
      population: 'Population',
      economy: 'Economy',
      cultures: 'Cultures',
    },
    relationships: {
      'Relationships Name': 'Relationships',
      allies: 'Allies',
      enemies: 'Enemies',
      relationships: 'Relationships',
      notoriety: 'Notoriety',
      influence: 'Influence',
    },
    history: {
      'History Name': 'History',
      events: 'Events',
      flags: 'Flags',
      history: 'History',
    },
    custom: {
      'Custom Name': 'Custom',
    },
  },
  'Sci-Fi': {
    system: {
      glossary: 'Tome',
      continent: 'Continent',
      territory: 'Territory',
      domain: 'Domain',
      province: 'Province',
      landmark: 'Landmark',
      settlement: 'Settlement',
      faction: 'Faction',
      location: 'Location',
      person: 'Person',
      event: 'Event',
      note: 'Note',
    },
    geography: {
      climates: 'Atmosphere',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    politics: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Agnostic: {
    system: {
      glossary: 'Tome',
      continent: 'Continent',
      territory: 'Territory',
      domain: 'Domain',
      province: 'Province',
      landmark: 'Landmark',
      settlement: 'Settlement',
      faction: 'Faction',
      location: 'Location',
      person: 'Person',
      event: 'Event',
      note: 'Note',
    },
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    politics: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Western: {
    system: {
      glossary: 'Tome',
      continent: 'Continent',
      territory: 'Territory',
      domain: 'Domain',
      province: 'Province',
      landmark: 'Landmark',
      settlement: 'Settlement',
      faction: 'Faction',
      location: 'Location',
      person: 'Person',
      event: 'Event',
      note: 'Note',
    },
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    politics: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Horror: {
    system: {
      glossary: 'Tome',
      continent: 'Continent',
      territory: 'Territory',
      domain: 'Domain',
      province: 'Province',
      landmark: 'Landmark',
      settlement: 'Settlement',
      faction: 'Faction',
      location: 'Location',
      person: 'Person',
      event: 'Event',
      note: 'Note',
    },
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    politics: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Modern: {
    system: {
      glossary: 'Tome',
      continent: 'Continent',
      territory: 'Territory',
      domain: 'Domain',
      province: 'Province',
      landmark: 'Landmark',
      settlement: 'Settlement',
      faction: 'Faction',
      location: 'Location',
      person: 'Person',
      event: 'Event',
      note: 'Note',
    },
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    politics: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Other: {
    system: {
      glossary: 'Tome',
      continent: 'Continent',
      territory: 'Territory',
      domain: 'Domain',
      province: 'Province',
      landmark: 'Landmark',
      settlement: 'Settlement',
      faction: 'Faction',
      location: 'Location',
      person: 'Person',
      event: 'Event',
      note: 'Note',
    },
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    politics: {},
    relationships: {},
    history: {},
    custom: {},
  },
};

export default function getPropertyLabel({
  glossary,
  section,
  key,
}: {
  glossary: { genre: Genre; integrationState: any };
  section: SubSectionTypes;
  key: string;
}) {
  const { genre, integrationState } = glossary;
  const sectionLabels = genrePropertyLabelDefaults[genre]?.[section];
  const label =
    integrationState?.terms?.[key] ||
    sectionLabels?.[key] ||
    'yo shit busted bruh';
  return label;
}
