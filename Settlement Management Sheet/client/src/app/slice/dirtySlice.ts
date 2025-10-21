import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DirtyEntry = {
  isDirty: boolean;
  dirtyKeypaths: Record<string, boolean>;
};

export type DirtyScopes = 'tab' | 'glossary' | 'event' | 'apt';

export type DirtyState = Record<DirtyScopes, Record<string, DirtyEntry>>;

const initialState: DirtyState = {
  tab: {},
  glossary: {},
  event: {},
  apt: {},
};

function ensureEntry(
  state: DirtyState,
  scope: DirtyScopes,
  id: string
): DirtyEntry {
  const existing = state[scope][id];
  if (existing) return existing;
  const created: DirtyEntry = {
    isDirty: true,
    dirtyKeypaths: Object.create(null),
  };
  state[scope][id] = created;
  return created;
}

const dirtySlice = createSlice({
  name: 'dirty',
  initialState,
  reducers: {
    addDirtyKeypath: (
      state,
      action: PayloadAction<{ keypath: string; id: string; scope: DirtyScopes }>
    ) => {
      const { keypath, id, scope } = action.payload;
      const entry = ensureEntry(state, scope, id);
      entry.dirtyKeypaths[keypath] = true;
    },
    addBulkDirtyKeypaths: (
      state,
      action: PayloadAction<{
        keypaths: string[];
        id: string;
        scope: DirtyScopes;
      }>
    ) => {
      const { keypaths, id, scope } = action.payload;
      const entry = ensureEntry(state, scope, id);
      keypaths.forEach((keypath) => {
        entry.dirtyKeypaths[keypath] = true;
      });
    },
    removeDirtyKeypath: (
      state,
      action: PayloadAction<{ id: string; keypath: string; scope: DirtyScopes }>
    ) => {
      const { id, keypath, scope } = action.payload;
      const entry = state[scope][id];
      if (!entry) return;
      if (Object.prototype.hasOwnProperty.call(entry.dirtyKeypaths, keypath)) {
        delete entry.dirtyKeypaths[keypath];
      }
      entry.isDirty = Object.keys(entry.dirtyKeypaths).length > 0;
      if (!entry.isDirty) delete state[scope][id];
    },
    clearDirtyKeypaths: (
      state,
      action: PayloadAction<{ id: string; key?: string; scope: DirtyScopes }>
    ) => {
      const { id, key, scope } = action.payload;
      const obj = state[scope][id];
      if (obj) {
        if (key) {
          Object.keys(obj.dirtyKeypaths).forEach((dirtyKey) => {
            if (dirtyKey.startsWith(`${key}.`)) {
              delete obj.dirtyKeypaths[dirtyKey];
            }
          });
        } else {
          delete state[scope][id];
        }
        if (Object.keys(obj.dirtyKeypaths).length === 0) obj.isDirty = false;
      }
    },
  },
});

export const {
  addDirtyKeypath,
  addBulkDirtyKeypaths,
  removeDirtyKeypath,
  clearDirtyKeypaths,
} = dirtySlice.actions;

export default dirtySlice.reducer;
