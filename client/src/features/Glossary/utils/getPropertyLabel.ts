import { useSelector } from 'react-redux';
import { Genre } from '../../../../../shared/types/index.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';

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
    region: 'Region',
    nation: 'Nation',
    territory: 'Territory',
    landmark: 'Landmark',
    settlement: 'Settlement',
    district: 'District',
    collective: 'Collective',
    location: 'Location',
    person: 'Person',
    event: 'Event',
    lore: 'Lore',
    item: 'Item',
  },
  'Sci-Fi': {
    glossary: 'Tome',
    continent: 'Continent',
    region: 'Region',
    nation: 'Nation',
    territory: 'Territory',
    landmark: 'Landmark',
    settlement: 'Settlement',
    district: 'District',
    collective: 'Collective',
    location: 'Location',
    person: 'Person',
    event: 'Event',
    lore: 'Lore',
    item: 'Item',
  },
  Agnostic: {
    glossary: 'Tome',
    continent: 'Continent',
    region: 'Region',
    nation: 'Nation',
    territory: 'Territory',
    landmark: 'Landmark',
    settlement: 'Settlement',
    district: 'District',
    collective: 'Collective',
    location: 'Location',
    person: 'Person',
    event: 'Event',
    lore: 'Lore',
    item: 'Item',
  },
  Western: {
    glossary: 'Tome',
    continent: 'Continent',
    region: 'Region',
    nation: 'Nation',
    territory: 'Territory',
    landmark: 'Landmark',
    settlement: 'Settlement',
    district: 'District',
    collective: 'Collective',
    location: 'Location',
    person: 'Person',
    event: 'Event',
    lore: 'Lore',
    item: 'Item',
  },
  Horror: {
    glossary: 'Tome',
    continent: 'Continent',
    region: 'Region',
    nation: 'Nation',
    territory: 'Territory',
    landmark: 'Landmark',
    settlement: 'Settlement',
    district: 'District',
    collective: 'Collective',
    location: 'Location',
    person: 'Person',
    event: 'Event',
    lore: 'Lore',
    item: 'Item',
  },
  Modern: {
    glossary: 'Tome',
    continent: 'Continent',
    region: 'Region',
    nation: 'Nation',
    territory: 'Territory',
    landmark: 'Landmark',
    settlement: 'Settlement',
    district: 'District',
    collective: 'Collective',
    location: 'Location',
    person: 'Person',
    event: 'Event',
    lore: 'Lore',
    item: 'Item',
  },
  Other: {
    glossary: 'Tome',
    continent: 'Continent',
    region: 'Region',
    nation: 'Nation',
    territory: 'Territory',
    landmark: 'Landmark',
    settlement: 'Settlement',
    district: 'District',
    collective: 'Collective',
    location: 'Location',
    person: 'Person',
    event: 'Event',
    lore: 'Lore',
    item: 'Item',
  },
  Mystery: {},
  Historical: {},
};

const usePropertyLabel = () => {
  const { glossary } = useGlossaryEditor();

  const getPropertyLabel = (key: string) => {
    const sectionLabels =
      genrePropertyLabelDefaults[glossary?.genre] ||
      genrePropertyLabelDefaults['Agnostic'];
    const label =
      glossary?.integrationState?.[key]?.label ||
      sectionLabels?.[key] ||
      'yo shit busted bruh';

    return {
      label,
      defaultLabel: sectionLabels?.[key] || 'yo shit busted bruh',
    };
  };

  return { getPropertyLabel };
};

export default function getPropertyLabel(
  key: string,
  glossary: GlossaryStateEntry
) {
  const sectionLabels =
    genrePropertyLabelDefaults[glossary?.genre as Genre] ||
    genrePropertyLabelDefaults['Agnostic'];
  const label =
    glossary?.integrationState?.system?.[key]?.label ||
    sectionLabels?.[key] ||
    'yo shit busted bruh';

  return {
    label,
    defaultLabel: sectionLabels?.[key] || 'yo shit busted bruh',
  };
}

export { usePropertyLabel };
