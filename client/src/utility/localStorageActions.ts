const getLocalStorageItem = <T>(key: string, fallback?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting local storage item:', error);
    return fallback ?? null;
  }
};

const setLocalStorageItem = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting local storage item:', error);
  }
};

const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing local storage item:', error);
  }
};

const createScopedStorage = (key: string) => ({
  get: (fallback?: any) => getLocalStorageItem(key, fallback),
  set: (value: any) => setLocalStorageItem(key, value),
  remove: () => removeLocalStorageItem(key),
});

export { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem };
export default createScopedStorage;
