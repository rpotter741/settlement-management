const countValidEntries = (items) => {
  const total = Object.keys(items).length;

  const valid = Object.values(items).filter((obj) => {
    // Check if every property (except "id") is null
    return Object.entries(obj).every(
      ([key, value]) => key === 'id' || value === null
    );
  }).length;

  return { valid, total };
};

export default countValidEntries;
