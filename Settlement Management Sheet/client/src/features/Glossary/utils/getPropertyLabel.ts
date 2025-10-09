import { useSelector } from 'react-redux';
import { Genre } from '../../../../../shared/types/index.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';

export type SubModelTypes =
  | 'system'
  | 'geography'
  | 'politics'
  | 'relationships'
  | 'history'
  | 'custom';

export const genrePropertyLabelDefaults: Record<
  Genre,
  Record<SubModelTypes, Record<string, string>>
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
      geography: 'Geography',
      climates: 'Climate',
      terrain: 'Terrain',
      regions: 'Regions',
      landmarks: 'Landmarks',
    },
    politics: {
      politics: 'Politics',
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
      relationships: 'Relationships',
      allies: 'Allies',
      enemies: 'Enemies',
      connections: 'Connections',
      notoriety: 'Notoriety',
      influence: 'Influence',
    },
    history: {
      history: 'History',
      events: 'Events',
      flags: 'Flags',
      historyData: 'Documentation',
    },
    custom: {
      custom: 'Custom',
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
      'Geography Name': 'Survivability Data',
      climates: 'Atmosphere',
      terrain: 'Geologic Profile',
      regions: 'Tectonic Region',
      locations: 'Significant Locale',
    },
    politics: {
      'Politics Name': 'Politics',
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
  Mystery: {
    system: {},
    geography: {},
    politics: {},
    relationships: {},
    history: {},
    custom: {},
  },
  Historical: {
    system: {},
    geography: {},
    politics: {},
    relationships: {},
    history: {},
    custom: {},
  },
};

const usePropertyLabel = () => {
  const { glossary } = useGlossaryEditor();
  if (!glossary)
    return { getPropertyLabel: () => ({ label: '', defaultLabel: '' }) };
  const { genre, integrationState } = glossary;

  const getPropertyLabel = (subModel: SubModelTypes, key: string) => {
    const sectionLabels = genrePropertyLabelDefaults[genre]?.[subModel];
    const label =
      integrationState?.[subModel]?.[key]?.label ||
      sectionLabels?.[key] ||
      'yo shit busted bruh';

    if (label === 'yo shit busted bruh') {
      console.log(subModel, key);
    }
    return {
      label,
      defaultLabel: sectionLabels?.[key] || 'yo shit busted bruh',
    };
  };

  return { getPropertyLabel };
};

export default function getPropertyLabel({
  glossary,
  subModel,
  key,
}: {
  glossary: { genre: Genre; integrationState: any };
  subModel: SubModelTypes;
  key: string;
}) {
  const { genre, integrationState } = glossary;
  const sectionLabels = genrePropertyLabelDefaults[genre]?.[subModel];
  const label =
    integrationState?.[subModel]?.[key]?.label ||
    sectionLabels?.[key] ||
    'yo shit busted bruh';

  if (label === 'yo shit busted bruh') {
    console.log(subModel, key);
  }
  return { label, defaultLabel: sectionLabels?.[key] || 'yo shit busted bruh' };
}

export { usePropertyLabel };
