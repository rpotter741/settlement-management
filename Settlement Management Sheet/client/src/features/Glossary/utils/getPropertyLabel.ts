import { Genre } from '@/components/shared/Metadata/GenreSelect.js';

export type SubSectionTypes =
  | 'geography'
  | 'political'
  | 'relationships'
  | 'history'
  | 'custom';

export const genrePropertyLabelDefaults: Record<
  Genre,
  Record<SubSectionTypes, Record<string, string>>
> = {
  Fantasy: {
    geography: {
      'Geography Name': 'Geography',
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      landmarks: 'Landmarks',
    },
    political: {
      'Political Name': 'Politics',
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
    custom: {},
  },
  'Sci-Fi': {
    geography: {
      climates: 'Atmosphere',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    political: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Agnostic: {
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    political: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Western: {
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    political: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Horror: {
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    political: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Modern: {
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    political: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Other: {
    geography: {
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      locations: 'Locations',
    },
    political: {},
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
  return (
    integrationState?.terms?.[key] ||
    sectionLabels?.[key] ||
    'yo shit busted bruh'
  );
}
