import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, isEqual, set } from 'lodash';
import {
  Tab,
  TabState,
  AddTabPayload,
  RemoveTabPayload,
  SetCurrentTabPayload,
  UpdateTabPayload,
  MoveTabPayload,
  SetTabDirtyPayload,
} from '../types/TabTypes.js';

const initialState: TabState = {
  left: {
    order: [],
    data: {},
    currentId: null,
    currentIndex: null,
  },
  right: {
    order: [],
    data: {},
    currentId: null,
    currentIndex: null,
  },
  splitTabs: false,
  preventSplit: false,
  focusedTab: null,
  lastRemovedTab: null,
};

const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<AddTabPayload>) => {
      const {
        name,
        mode,
        id,
        tool,
        tabId,
        activate,
        side = 'left',
        preventSplit = false,
        tabType = 'tool',
        disableMenu = false,
        glossaryId = undefined,
      } = action.payload;
      const entry: Tab = {
        name,
        id,
        mode,
        side,
        tool,
        tabId,
        viewState: {
          dirtyKeypaths: {},
          scroll: 0,
          isDirty: false,
          lastUpdated: {},
        },
        preventSplit,
        tabType,
        disableMenu,
        glossaryId,
      };
      if (side === 'left' || state.preventSplit) {
        state.left.data[tabId] = entry;
        state.left.order.push(tabId);
      } else {
        if (!state.splitTabs) {
          state.splitTabs = true;
        }
        state.right.data[tabId] = entry;
        state.right.order.push(tabId);
      }
      if (activate) {
        if (side === 'left' || state.preventSplit) {
          state.left.currentIndex = state.left.order.length - 1;
          state.left.currentId = tabId;
        } else {
          state.right.currentIndex = state.right.order.length - 1;
          state.right.currentId = tabId;
        }
      }
      if (preventSplit) {
        state.preventSplit = preventSplit;
      }
    },
    removeTab: (state, action: PayloadAction<RemoveTabPayload>) => {
      const { tabId, side, preventSplit } = action.payload;
      if (side === 'left' || state.preventSplit) {
        state.left.order = state.left.order.filter((id) => id !== tabId);
        if (state.left.currentId === tabId) {
          const leftTab = state.left.data[state.left.order[0]];
          if (leftTab) {
            state.left.currentId = leftTab.tabId;
            state.left.currentIndex = 0;
            if (state.focusedTab?.tabId === tabId) {
              state.focusedTab = leftTab;
            }
          }
        }
        if (state.left.order.length === 0 && state.right.order.length !== 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.right.order.forEach((id) => {
            const tab = state.right.data[id];
            if (tab) {
              tab.side = 'left';
              state.left.order.push(id);
              state.left.data[id] = tab;
            }
          });
          state.left.currentId = state.right.currentId;
          state.left.currentIndex = state.right.currentIndex;
          state.right.order = [];
          state.right.currentId = null;
          state.right.currentIndex = null;
        } else if (
          state.left.order.length === 0 &&
          state.right.order.length === 0
        ) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.left.currentId = null;
          state.left.currentIndex = null;
          state.right.currentId = null;
          state.right.currentIndex = null;
          state.focusedTab = null;
          state.left.data = {};
          state.right.data = {};
        }
      } else {
        state.right.order = state.right.order.filter((id) => id !== tabId);
        if (state.right.currentId === tabId) {
          const rightTab = state.right.data[state.right.order[0]];
          if (rightTab) {
            state.right.currentId = rightTab.tabId;
            state.right.currentIndex = 0;
            if (state.focusedTab?.tabId === tabId) {
              state.focusedTab = rightTab;
            }
          }
        }
        if (state.right.order.length === 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.right.currentId = null;
          state.right.currentIndex = null;
          state.right.data = {};
        }
        if (state.left.order.length > 0 && state.left.currentIndex !== null) {
          state.focusedTab =
            state.left.data[state.left.order[state.left.currentIndex]];
        }
      }
      state.lastRemovedTab = tabId;
      if (preventSplit !== undefined) state.preventSplit = preventSplit;
    },
    setCurrentTab: (state, action: PayloadAction<SetCurrentTabPayload>) => {
      const { index, tabId, side = 'left' } = action.payload;
      if (side === 'left' || state.preventSplit) {
        state.left.currentIndex = index;
        state.left.currentId = tabId;
      } else {
        state.right.currentIndex = index;
        state.right.currentId = tabId;
      }
    },
    updateTab: (state, action: PayloadAction<UpdateTabPayload>) => {
      const { tabId, keypath, updates } = action.payload;
      if (state.lastRemovedTab === tabId) {
        state.lastRemovedTab = null;
        return;
      }
      const tab = state.left.data[tabId] || state.right.data[tabId];
      if (!tab) {
        console.warn(`Tab with id ${tabId} not found in updateTab`);
        return;
      }
      set(tab, keypath, updates);
      if (state.focusedTab?.tabId === tabId) {
        set(state.focusedTab, keypath, updates);
      }
    },
    moveRightToLeft: (state, action: PayloadAction<MoveTabPayload>) => {
      const { tabId, dropIndex } = action.payload;
      const tab = cloneDeep(state.right.data[tabId]);
      if (tab) {
        tab.side = 'left';
        state.left.data[tabId] = tab;
        state.left.currentId = tabId;
        if (dropIndex !== undefined) {
          state.left.order.splice(dropIndex, 0, tabId);
          state.left.currentIndex = dropIndex;
        } else {
          state.left.order.push(tabId);
          state.left.currentIndex = state.left.order.length - 1;
        }
        state.focusedTab = tab;
        const newTabs = state.right.order.filter((tab) => tab !== tabId);
        state.right.order = newTabs;

        if (newTabs.length === 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.right.currentId = null;
          state.right.currentIndex = null;
          state.right.data = {};
        }
      } else {
        console.error(`Tab with id ${tabId} not found in right tabs`);
      }
    },
    moveLeftToRight: (state, action: PayloadAction<MoveTabPayload>) => {
      const { tabId, dropIndex } = action.payload;
      if (state.preventSplit || state.left.order.length <= 1) {
        return;
      }
      const tab = cloneDeep(state.left.data[tabId]);
      if (tab) {
        tab.side = 'right';
        state.right.data[tabId] = tab;
        if (dropIndex !== undefined) {
          state.right.order.splice(dropIndex, 0, tabId);
          state.right.currentIndex = dropIndex;
          state.right.currentId = tabId;
        } else {
          state.right.order.push(tabId);
          state.right.currentId = tabId;
          state.right.currentIndex = state.right.order.length - 1;
        }
        state.focusedTab = tab;
        state.left.order = state.left.order.filter((id) => id !== tabId);
        delete state.left.data[tabId];
        state.splitTabs = true;

        if (state.left.currentId === tabId) {
          state.left.currentId =
            state.left.data[state.left.order[0]]?.tabId || null;
          state.left.currentIndex = 0;
        }
      }
    },
    setSplit: (state, action) => {
      const { split } = action.payload;
      state.splitTabs = split;
    },
    setPrevent: (state, action) => {
      const { prevent } = action.payload;
      state.preventSplit = prevent;
      if (prevent) {
        Object.entries(state.right.data).forEach(([id, tab]) => {
          tab.side = 'left';
          state.left.data[id] = tab;
        });
        state.right.data = {};
        state.right.currentId = null;
        state.right.currentIndex = null;
        state.splitTabs = false;
        state.left.currentId =
          state.left.data[state.left.order[0]]?.tabId || null;
        state.left.currentIndex = state.left.order[0] ? 0 : null;
        state.focusedTab = state.left.data[state.left.order[0]] || null;
      }
    },
    setTabDirty: (state, action: PayloadAction<SetTabDirtyPayload>) => {
      const { id, isDirty } = action.payload;
      if (state.left.data[id]) {
        state.left.data[id].viewState.isDirty = isDirty;
      } else if (state.right.data[id]) {
        state.right.data[id].viewState.isDirty = isDirty;
      }
      if (state.focusedTab?.id === id) {
        state.focusedTab.viewState.isDirty = isDirty;
      }
    },
    addDirtyKeypath: (
      state,
      action: PayloadAction<{ tabId: string; keypath: string }>
    ) => {
      const { tabId, keypath } = action.payload;
      const tab = state.left.data[tabId] || state.right.data[tabId];
      if (tab) {
        tab.viewState.dirtyKeypaths[keypath] = true;
        if (tab.viewState.isDirty === false) {
          tab.viewState.isDirty = true;
        }
      } else {
        console.error(`Tab with id ${tabId} not found`);
      }
    },
    removeDirtyKeypath: (
      state,
      action: PayloadAction<{ tabId: string; keypath: string }>
    ) => {
      const { tabId, keypath } = action.payload;
      const tab = state.left.data[tabId] || state.right.data[tabId];
      if (tab) {
        delete tab.viewState.dirtyKeypaths[keypath];
        if (Object.keys(tab.viewState.dirtyKeypaths).length === 0) {
          tab.viewState.isDirty = false;
        }
      } else {
        console.error(`Tab with id ${tabId} not found`);
      }
    },
    clearDirtyKeypaths: (
      state,
      action: PayloadAction<{ tabId: string; key?: string }>
    ) => {
      const { tabId, key } = action.payload;
      const tab = state.left.data[tabId] || state.right.data[tabId];
      if (tab) {
        if (key) {
          Object.keys(tab.viewState.dirtyKeypaths).forEach((dirtyKey) => {
            if (dirtyKey.startsWith(`${key}.`)) {
              delete tab.viewState.dirtyKeypaths[dirtyKey];
            }
          });
        } else {
          tab.viewState.dirtyKeypaths = {};
        }
        tab.viewState.isDirty = false;
      } else {
        console.error(`Tab with id ${tabId} not found`);
      }
    },
    setActiveTab: (state, action: PayloadAction<{ tab: Tab }>) => {
      const { tab } = action.payload;
      state.focusedTab = tab;
    },
  },
});

export const {
  addTab,
  removeTab,
  setCurrentTab,
  updateTab,
  moveLeftToRight,
  moveRightToLeft,
  setSplit,
  setPrevent,
  setTabDirty,
  setActiveTab,
  addDirtyKeypath,
  removeDirtyKeypath,
  clearDirtyKeypaths,
} = tabSlice.actions;

export default tabSlice.reducer;
