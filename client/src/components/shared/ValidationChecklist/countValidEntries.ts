const countValidEntries = (items) => {
  const total = Object.keys(items).length;

  const valid = Object.values(items).filter((obj) => {
    if (!obj) return false;
    // Check if every property (except "id / refId") is null
    return Object.entries(obj).every(
      ([key, value]) => key === 'id' || key === 'refId' || value === null
    );
  }).length;

  return { valid, total };
};

export default countValidEntries;
