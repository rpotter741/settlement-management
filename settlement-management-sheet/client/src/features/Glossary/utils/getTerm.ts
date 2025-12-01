import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';
import { entryTypes, GlossaryEntryTypeString } from './glossaryConstants.js';

export const genreSectionDefaults: Record<
  Genre,
  Record<GlossaryEntryTypeString | string, string>
> = {
  Fantasy: {
    'System Name': 'Custom Name',
    glossary: 'Tome',
    continent: 'Continent',
    region: 'Territory',
    nation: 'Domain',
    territory: 'Province',
    landmark: 'Landmark',
    settlement: 'Settlement',
    collective: 'Faction',
    location: 'Location',
    person: 'Person',
    event: 'Event',
    lore: 'Note',
  },
  'Sci-Fi': {
    'System Name': 'Custom Name',
    glossary: 'Codex',
    continent: 'Galaxy',
    region: 'Sector',
    nation: 'Solar System',
    territory: 'Planet',
    landmark: 'Geographic Feature',
    settlement: 'Metropolis',
    collective: 'Corporation',
    location: 'Point of Interest',
    person: 'Person',
    event: 'Event',
    lore: 'Note',
  },
  Agnostic: {},
  Western: {},
  Horror: {},
  Modern: {},
  Other: {},
};

export default function getTerm({
  glossary,
  key,
}: {
  glossary: GlossaryStateEntry;
  key: string;
}): string {
  if (!glossary || !key) return '';
  const { genre, integrationState } = glossary;
  return (
    integrationState?.terms?.[key] ||
    genreSectionDefaults[genre]?.[key] ||
    'yo shit busted bruh'
  );
}
