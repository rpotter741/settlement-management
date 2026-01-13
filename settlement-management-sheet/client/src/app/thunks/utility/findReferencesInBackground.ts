import findLinkedReferences from './findLinkedReferences.js';

export default async function findReferencesInBackground(
  glossaryCache: Record<string, any>,
  subTypeMap: Record<string, any>,
  deletedIds: string[]
) {
  const affectedEntries = new Map<
    string,
    { keypath: string; oldValue: any; newValue: any }[]
  >();
  let processed = 0;

  for (const entry of Object.values(glossaryCache)) {
    const subType = subTypeMap[entry.subTypeId];
    const sourceData = findLinkedReferences({
      source: entry,
      subType,
      linkedId: deletedIds,
    });
    if (sourceData) {
      const { id, data } = sourceData;
      affectedEntries.set(id, data);
    }
    processed++;
    if (processed % 100 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  return affectedEntries;
}
