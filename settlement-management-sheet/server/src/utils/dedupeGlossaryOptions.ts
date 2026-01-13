import capitalize from '../utils/capitalize.ts';

type Relationships = 'inherited' | 'nearby' | 'extended' | 'other';

const RELATIONSHIP_PRIORITY = [
  'inherited',
  'nearby',
  'extended',
  'other',
] as const;

type RelationshipType = (typeof RELATIONSHIP_PRIORITY)[number];

interface SmartGlossaryOption {
  value: string;
  label: string;
  group: string;
  sources: {
    id: string;
    name: string;
    relationship: RelationshipType;
  }[];
}

function dedupeGroupedGlossaryOptions(
  raw: Record<
    RelationshipType,
    { id: string; name: string; [key: string]: any }[]
  >,
  property: string
): SmartGlossaryOption[] {
  const map = new Map<string, SmartGlossaryOption>();
  const relationships = {
    inherited: 1,
    nearby: 2,
    extended: 3,
    other: 4,
  };
  for (const rel of Object.keys(relationships)) {
    for (const entry of raw[rel] ?? []) {
      const values = Array.isArray(entry[property])
        ? entry[property]
        : entry[property];
      if (!values) continue;
      for (const value of values) {
        if (map.has(value)) {
          const existing = map.get(value)!;
          existing.sources.push({
            id: entry.id,
            name: entry.name,
            relationship: rel as RelationshipType,
          });
          const tier = relationships[rel];
          const existingTier =
            relationships[existing.group as RelationshipType];

          if (
            relationships[rel as RelationshipType] <
            relationships[existing.group as RelationshipType]
          ) {
            console.log(
              'Updating group for',
              value,
              'from',
              existing.group,
              'to',
              rel
            );
            existing.group = rel as RelationshipType;
          }
        } else {
          map.set(value, {
            value,
            label: value,
            group: rel,
            sources: [{ id: entry.id, name: entry.name, relationship: rel }],
          });
        }
      }
    }
  }

  return [...map.values()].map((option) => ({
    ...option,
    label: capitalize(option.label),
    group: capitalize(option.group),
  }));
}

export default dedupeGroupedGlossaryOptions;
