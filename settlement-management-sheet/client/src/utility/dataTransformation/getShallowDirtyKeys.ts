function getShallowDirtyKeys(dirtyMap: Record<string, boolean>) {
  const keys = Object.keys(dirtyMap).sort();
  const result = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const lastKept = result[result.length - 1];
    // Check if this key is nested under the last kept key
    if (!lastKept || !key.startsWith(lastKept + '.')) {
      result.push(key);
    }
  }

  // Rebuild the object if you want the same shape
  const finalMap: Record<string, boolean> = {};
  for (const k of result) finalMap[k] = true;

  return finalMap;
}

export default getShallowDirtyKeys;
