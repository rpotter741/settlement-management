const mergeKit = (kit = {}, settlement = {}) => {
  const result = {};

  const allKeys = new Set([...Object.keys(kit), ...Object.keys(settlement)]);

  allKeys.forEach((key) => {
    const merged = [];
    const refMap = new Map(); // refId -> { name, id[], leads[] }

    const pushEntries = (sourceArray = [], lead) => {
      if (!Array.isArray(sourceArray)) {
        return;
      }
      for (const entry of sourceArray) {
        const { refId, id, name } = entry;
        if (!refMap.has(refId)) {
          refMap.set(refId, {
            refId: [refId],
            ids: [id],
            name,
            leads: [lead],
          });
        } else {
          const existing = refMap.get(refId);
          if (!existing.ids.includes(id)) {
            existing.ids.push(id);
            existing.leads = ['K', 'S']; // force override to reflect mismatch
          } else if (!existing.leads.includes(lead)) {
            existing.leads.push(lead);
          }
        }
      }
    };

    pushEntries(kit[key], 'K');
    pushEntries(settlement[key], 'S');

    for (const { refId, ids, name, leads } of refMap.values()) {
      merged.push({
        refId,
        id: ids.length === 1 ? [ids[0]] : ids,
        name,
        leads:
          leads.includes('K') && leads.includes('S') && ids.length === 1
            ? ['B']
            : leads,
      });
    }

    result[key] = merged;
  });

  return result;
};

export default mergeKit;
