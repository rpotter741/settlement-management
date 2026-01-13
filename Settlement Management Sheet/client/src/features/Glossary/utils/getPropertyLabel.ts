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
  Record<string, string>
> = {
  Fantasy: {
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
  'Sci-Fi': {
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
  Agnostic: {
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
  Western: {
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
  Horror: {
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
  Modern: {
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
  Other: {
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
  Mystery: {},
  Historical: {},
};

const usePropertyLabel = () => {
  const { glossary } = useGlossaryEditor();
  if (!glossary)
    return { getPropertyLabel: () => ({ label: '', defaultLabel: '' }) };
  const { genre, integrationState } = glossary;

  const getPropertyLabel = (key: string) => {
    const sectionLabels = genrePropertyLabelDefaults[genre];
    const label =
      integrationState?.[key]?.label ||
      sectionLabels?.[key] ||
      'yo shit busted bruh';

    if (label === 'yo shit busted bruh') {
      console.log(key);
    }

    console.log(label, sectionLabels?.[key]);
    return {
      label,
      defaultLabel: sectionLabels?.[key] || 'yo shit busted bruh',
    };
  };

  return { getPropertyLabel };
};

export default function getPropertyLabel({
  glossary,
  key,
}: {
  glossary: { genre: Genre; integrationState: any };
  key: string;
}) {
  const { genre, integrationState } = glossary;

  const sectionLabels = genrePropertyLabelDefaults[genre];
  const label =
    integrationState?.[key]?.label ||
    sectionLabels?.[key] ||
    'yo shit busted bruh';

  if (label === 'yo shit busted bruh') {
    console.log(key);
  }
  console.log(label, sectionLabels?.[key]);

  return {
    label,
    defaultLabel: sectionLabels?.[key] || 'yo shit busted bruh',
  };
}

export { usePropertyLabel };
