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
    'System Name': 'Custom Name',
    glossary: 'Codex',
    continent: 'Galaxy',
    territory: 'Sector',
    domain: 'Solar System',
    province: 'Planet',
    landmark: 'Geographic Feature',
    settlement: 'Metropolis',
    faction: 'Corporation',
    location: 'Point of Interest',
    person: 'Person',
    event: 'Event',
    note: 'Note',
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
    integrationState?.terms?.[key] || genreSectionDefaults[genre]?.[key] || ''
  );
}
