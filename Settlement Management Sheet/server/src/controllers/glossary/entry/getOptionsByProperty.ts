import prisma from '../../../db/db.ts';
import glossaryModelMap from '../../../utils/glossaryModelMap.ts';
import glossaryTypeMap from '../../../utils/glossaryTypeMap.ts';
import requireFields from '../../../utils/requireFields.ts';
import fallbackPropertyMap from '../../../utils/fallbackPropertyMap.ts';

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
