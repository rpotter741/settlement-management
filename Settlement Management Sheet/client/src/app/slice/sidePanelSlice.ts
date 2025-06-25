import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { isEqual, set } from 'lodash';
import {
  Tab,
  TabState,
  AddTabPayload,
  RemoveTabPayload,
  SetCurrentTabPayload,
  SetBreadcrumbsPayload,
  UpdateTabPayload,
  MoveTabPayload,
  OptionObject,
  SetToolOptionsPayload,
  SetTabDirtyPayload,
} from '../types/SidePanelTypes.js';

const initialState: TabState = {
  leftTabs: [],
  rightTabs: [],
  sidePanelOpen: true,
  splitTabs: false,
  preventSplit: false,
  currentLeftTab: null,
  currentRightTab: null,
  currentLeftTabIndex: null,
  currentRightTabIndex: null,
  focusedTab: null,
  breadcrumbs: [],
  toolOptions: {},
};

const sidePanelSlice = createSlice({
  name: 'sidePanel',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<AddTabPayload>) => {
      const {
        name,
        mode,
        id,
        tool,
        tabId,
        scroll,
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
        scroll,
        preventSplit,
        isDirty: false,
        tabType,
        disableMenu,
        glossaryId,
      };
      if (side === 'left' || state.preventSplit) {
        state.leftTabs.push(entry);
      } else {
        if (!state.splitTabs) {
          state.splitTabs = true;
        }
        state.rightTabs.push(entry);
      }
      if (activate) {
        if (side === 'left' || state.preventSplit) {
          state.currentLeftTabIndex = state.leftTabs.length - 1;
          state.currentLeftTab = tabId;
        } else {
          state.currentRightTabIndex = state.rightTabs.length - 1;
          state.currentRightTab = tabId;
        }
      }
      if (preventSplit) {
        state.preventSplit = preventSplit;
      }
    },
    toggleSidePanel: (state) => {
      state.sidePanelOpen = !state.sidePanelOpen;
    },
    removeTab: (state, action: PayloadAction<RemoveTabPayload>) => {
      const { tabId, side, preventSplit } = action.payload;
      if (side === 'left' || state.preventSplit) {
        state.leftTabs = state.leftTabs.filter((tab) => tab.tabId !== tabId);
        if (state.currentLeftTab === tabId) {
          const leftTab = state.leftTabs[0];
          if (leftTab) {
            state.currentLeftTab = state.leftTabs[0].tabId;
            state.currentLeftTabIndex = 0;
            if (state.focusedTab?.tabId === tabId) {
              state.focusedTab = leftTab;
            }
          }
        }
        if (state.leftTabs.length === 0 && state.rightTabs.length !== 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.rightTabs.forEach((tab) => {
            tab.side = 'left';
            state.leftTabs.push(tab);
            if (state.focusedTab?.tabId === tab.tabId) {
              state.focusedTab = tab;
            }
          });
          state.currentLeftTab = state.currentRightTab;
          state.currentLeftTabIndex = state.currentRightTabIndex;
          state.rightTabs = [];
          state.currentRightTab = null;
          state.currentRightTabIndex = null;
        } else if (
          state.leftTabs.length === 0 &&
          state.rightTabs.length === 0
        ) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.currentLeftTab = null;
          state.currentLeftTabIndex = null;
          state.currentRightTab = null;
          state.currentRightTabIndex = null;
          state.focusedTab = null;
          state.leftTabs = [];
          state.rightTabs = [];
        }
      } else {
        state.rightTabs = state.rightTabs.filter((tab) => tab.tabId !== tabId);
        if (state.currentRightTab === tabId) {
          const rightTab = state.rightTabs[0];
          if (rightTab) {
            state.currentRightTab = rightTab.tabId;
            state.currentRightTabIndex = 0;
            if (state.focusedTab?.tabId === tabId) {
              state.focusedTab = rightTab;
            }
          }
        }
        if (state.rightTabs.length === 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.currentRightTab = null;
          state.currentRightTabIndex = null;
          state.rightTabs = [];
        }
        if (state.leftTabs.length > 0 && state.currentLeftTabIndex !== null) {
          state.focusedTab = state.leftTabs[state.currentLeftTabIndex];
        }
      }
      if (preventSplit !== undefined) state.preventSplit = preventSplit;
    },
    setCurrentTab: (state, action: PayloadAction<SetCurrentTabPayload>) => {
      const { index, tabId, side = 'left' } = action.payload;
      if (side === 'left' || state.preventSplit) {
        state.currentLeftTabIndex = index;
        state.currentLeftTab = tabId;
      } else {
        state.currentRightTabIndex = index;
        state.currentRightTab = tabId;
      }
    },
    setBreadcrumbs: (state, action: PayloadAction<SetBreadcrumbsPayload>) => {
      const { breadcrumbs } = action.payload;
      state.breadcrumbs = breadcrumbs;
    },
    updateTab: (state, action: PayloadAction<UpdateTabPayload>) => {
      const { tabId, side, keypath, updates } = action.payload;
      if (side === 'left' || state.preventSplit) {
        const index = state.leftTabs.findIndex((tab) => tab.tabId === tabId);
        if (index === -1) {
          console.error(`Tab with id ${tabId} not found in left tabs`);
          return;
        }
        set(state.leftTabs[index], keypath, updates);
      } else {
        const index = state.rightTabs.findIndex((tab) => tab.tabId === tabId);
        if (index === -1) {
          console.error(`Tab with id ${tabId} not found in right tabs`);
          return;
        }
        set(state.rightTabs[index], keypath, updates);
      }
      if (state.focusedTab?.tabId === tabId) {
        set(state.focusedTab, keypath, updates);
      }
    },
    moveRightToLeft: (state, action: PayloadAction<MoveTabPayload>) => {
      const { tabId, dropIndex } = action.payload;
      const tab = state.rightTabs.find((tab) => tab.tabId === tabId);
      if (tab) {
        tab.side = 'left';
        if (dropIndex !== undefined) {
          state.leftTabs.splice(dropIndex, 0, tab);
          state.currentLeftTabIndex = dropIndex;
          state.currentLeftTab = tabId;
        } else {
          state.leftTabs.push(tab);
          state.currentLeftTab = tabId;
          state.currentLeftTabIndex = state.leftTabs.length - 1;
          if (state.focusedTab?.tabId === tabId) {
            state.focusedTab = tab;
          }
        }
        const newTabs = state.rightTabs.filter((tab) => tab.tabId !== tabId);
        state.rightTabs = newTabs;

        if (newTabs.length === 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.currentRightTab = null;
          state.currentRightTabIndex = null;
          state.rightTabs = [];
        }
        if (state.currentRightTab === tabId) {
          state.currentRightTab = state.rightTabs[0]?.tabId || null;
          state.currentRightTabIndex = state.rightTabs[0] ? 0 : null;
        }
      }
    },
    moveLeftToRight: (state, action: PayloadAction<MoveTabPayload>) => {
      const { tabId, dropIndex } = action.payload;
      if (state.preventSplit || state.leftTabs.length <= 1) {
        return;
      }
      const tab = state.leftTabs.find((tab) => tab.tabId === tabId);
      if (tab) {
        tab.side = 'right';
        if (dropIndex !== undefined) {
          state.rightTabs.splice(dropIndex, 0, tab);
          state.currentRightTabIndex = dropIndex;
          state.currentRightTab = tabId;
        } else {
          state.rightTabs.push(tab);
          state.currentRightTab = tabId;
          state.currentRightTabIndex = state.rightTabs.length - 1;
          if (state.focusedTab?.tabId === tabId) {
            state.focusedTab = tab;
          }
        }
        state.leftTabs = state.leftTabs.filter((tab) => tab.tabId !== tabId);
        state.splitTabs = true;

        if (state.currentLeftTab === tabId) {
          state.currentLeftTab = state.leftTabs[0].tabId;
          state.currentLeftTabIndex = 0;
        }
      }
    },
    setToolOptions: (state, action: PayloadAction<SetToolOptionsPayload>) => {
      const { options } = action.payload;
      state.toolOptions = options;
    },
    setSplit: (state, action) => {
      const { split } = action.payload;
      state.splitTabs = split;
    },
    setPrevent: (state, action) => {
      const { prevent } = action.payload;
      state.preventSplit = prevent;
      if (prevent) {
        state.rightTabs.forEach((tab) => {
          tab.side = 'left';
          state.leftTabs.push(tab);
        });
        state.rightTabs = [];
        state.currentRightTab = null;
        state.currentRightTabIndex = null;
        state.splitTabs = false;
        state.currentLeftTab = state.leftTabs[0]?.tabId || null;
        state.currentLeftTabIndex = state.leftTabs[0] ? 0 : null;
        state.focusedTab = state.leftTabs[0] || null;
      }
    },
    setTabDirty: (state, action: PayloadAction<SetTabDirtyPayload>) => {
      const { id, isDirty } = action.payload;
      const leftIndex = state.leftTabs.findIndex((tab) => tab.id === id);
      const rightIndex = state.rightTabs.findIndex((tab) => tab.id === id);
      if (leftIndex !== -1) {
        set(state.leftTabs[leftIndex], 'isDirty', isDirty);
      }
      if (rightIndex !== -1) {
        set(state.rightTabs[rightIndex], 'isDirty', isDirty);
      }
      if (state.focusedTab?.id === id) {
        state.focusedTab.isDirty = isDirty;
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
  toggleSidePanel,
  removeTab,
  setCurrentTab,
  setBreadcrumbs,
  updateTab,
  moveLeftToRight,
  moveRightToLeft,
  setToolOptions,
  setSplit,
  setPrevent,
  setTabDirty,
  setActiveTab,
} = sidePanelSlice.actions;

export default sidePanelSlice.reducer;
