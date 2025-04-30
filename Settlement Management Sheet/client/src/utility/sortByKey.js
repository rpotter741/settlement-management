export const sortByKey = (array = [], key) => {
  if (!Array.isArray(array) || !key) return [];

  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal == null || bVal == null) return 0;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal;
    }

    return String(aVal).localeCompare(String(bVal), undefined, {
      sensitivity: 'base',
    });
  });
};

export default sortByKey;
