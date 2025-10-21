import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import glossaryTypeMap from '../../../utils/glossaryTypeMap.ts';
import requireFields from '../../../utils/requireFields.ts';
import fallbackPropertyMap from '../../../utils/fallbackPropertyMap.ts';

/*
Okay. so we're gonna need to do a lot of work here. Maybe not a lot. But!

First, we're going to need to get the glossary integration state. I think fetching
that will be useful to possibly omitting entry types that don't have the property.

With that, we need a helper to build a map of booleans by entry type and property.
This way we have O(1) access to check if a property exists for an entry type.

Next, we iterate through all of the entries, comparing their types to the integration state.
That allows us to respect user's configuration while still returning all the data.

I don't think we need to check an entry's integration state because if it's disabled,
then it shouldn't have data in the first place.

All of this, too, is going to have to be taking into account both integration state as a whole and any saved subTypes, which means we'll want each section or detail to have a 'templateId' field that's nullable. We might get something like this:

const integrationState = prisma.glossary.findUnique({ where: { id: glossaryId }, select: { integrationState: true, subTypes: true } });

then a helper called 'mapPropertyIntegrationState' that references it and returns something like this:
  {
    continent: {
      default: true,
      templateIdA: false,
      templateIdB: true,
    },
    domain: {
      default: false,
      templateIdA: true,
    },
    settlement: {
      default: true,
    },
    ...
  }

  Then when we iterate through the entries, we can just do a quick map check of the property against the integration state map to see if it should be included in the results.

*/

export default async function getOptionsByProperty(req, res) {
  try {
    const { property, inheritanceMap } = req.body;
    if (!requireFields(['property', 'inheritanceMap'], req.body, res)) return;
    const { relationships, entryTypeMap } = inheritanceMap || {};
    const allEntries: any = [];
    for (const [entryType, ids] of Object.entries(entryTypeMap)) {
      if (!(ids as string[]).length) continue;
      const model = glossaryModelMap[entryType];
      if (!model) {
        console.warn(`No model found for entry type: ${entryType}`);
        continue;
      }
      const shape = glossaryTypeMap[entryType];
      if (!shape || !(property in shape)) {
        console.warn(
          `Property ${property} not found in model for ${entryType}`
        );
        continue;
      }
      const entries = await model.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          name: true,
          [property]: true,
        },
      });
      allEntries.push(...entries);
    }
    const fallback = fallbackPropertyMap[property] || [];
    const allProperties = new Map();
    type Entry = { id: string; name: string; [key: string]: any };
    const results: {
      inherited: Entry[];
      nearby: Entry[];
      extended: Entry[];
      other: Entry[];
    } = { inherited: [], nearby: [], extended: [], other: [] };
    allEntries.forEach((entry: any) => {
      if (relationships[entry.id] === 'parent') {
        results.inherited.push(entry);
        if (!allProperties.has(property)) {
          allProperties.set(property, []);
        }
        allProperties.get(property).push(entry[property]);
      } else if (relationships[entry.id] === 'sibling') {
        results.nearby.push(entry);
        allProperties.set(property, [
          entry[property],
          ...(allProperties.get(property) || []),
        ]);
      } else if (relationships[entry.id] === 'extended') {
        results.extended.push(entry);
        allProperties.set(property, [
          entry[property],
          ...(allProperties.get(property) || []),
        ]);
      }
    });
    console.log(results, 'results from getOptionsByProperty before fallback');
    const other = fallback.filter((item) => !allProperties.has(item));
    results.other = other.map((value) => ({
      id: value[0],
      name: value[0],
      [property]: value,
    }));
    console.log(results, 'results from getOptionsByProperty');
    res.status(200).json({
      property,
      results,
    });
  } catch (error) {
    console.error(`Error getting options by property:`, error);
    return res
      .status(500)
      .json({ message: `Error getting options by property.` });
  }
}
