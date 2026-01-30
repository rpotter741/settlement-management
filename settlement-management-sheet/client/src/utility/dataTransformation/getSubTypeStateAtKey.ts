import store, { RootState } from '@/app/store.ts';
/**
 * Retrieves the sub-type state for a given key and ID.
 *
 * Attempts to find the state in the system edit first, falling back to user edit if not found.
 *
 * @typeParam T - The type of the state object being retrieved.
 * @param key - The key identifying which sub-type to access from state.
 * @param id - The ID of the specific edit entry to retrieve.
 * @returns The state object cast to type T, or undefined if not found.
 */
function getSubTypeStateAtKey<T>(
  key: keyof RootState['subType'],
  id: string
): T | undefined {
  const state = store.getState();
  const slice = state.subType[key];

  // Check system first (less common, fail fast)
  if (id in slice.system.edit) {
    return slice.system.edit[id] as T;
  }

  // Fall back to user
  if (id in slice.user.edit) {
    return slice.user.edit[id] as T;
  }

  return undefined;
}
export default getSubTypeStateAtKey;
