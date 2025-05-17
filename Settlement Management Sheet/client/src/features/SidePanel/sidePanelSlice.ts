import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'lodash';
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
} from './types.js';

const initialState: TabState = {
  leftTabs: [],
  rightTabs: [],
  splitTabs: false,
  preventSplit: false,
  currentLeftTab: null,
  currentRightTab: null,
  currentLeftTabIndex: null,
  currentRightTabIndex: null,
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
        preventSplit,
      } = action.payload;
      const entry: Tab = { name, id, mode, tool, tabId, scroll, preventSplit };
      console.log('Adding tab:', entry);
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
    removeTab: (state, action: PayloadAction<RemoveTabPayload>) => {
      const { tabId, side, preventSplit } = action.payload;
      if (side === 'left' || state.preventSplit) {
        state.leftTabs = state.leftTabs.filter((tab) => tab.tabId !== tabId);
        if (state.currentLeftTab === tabId) {
          state.currentLeftTab = state.leftTabs[0]?.tabId || null;
          state.currentLeftTabIndex = state.leftTabs[0] ? 0 : null;
        }
        if (state.leftTabs.length === 0 && state.rightTabs.length !== 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.leftTabs = [...state.rightTabs];
          state.currentLeftTab = state.currentRightTab;
          state.currentLeftTabIndex = state.currentRightTabIndex;
          state.rightTabs = [];
          state.currentRightTab = null;
          state.currentRightTabIndex = null;
        }
      } else {
        state.rightTabs = state.rightTabs.filter((tab) => tab.tabId !== tabId);
        if (state.currentRightTab === tabId) {
          state.currentRightTab = state.rightTabs[0]?.tabId || null;
          state.currentRightTabIndex = state.rightTabs[0] ? 0 : null;
        }
        if (state.rightTabs.length === 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.currentRightTab = null;
          state.currentRightTabIndex = null;
          state.rightTabs = [];
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
      const { index, side, updates } = action.payload;
      if (side === 'left' || state.preventSplit) {
        set(state.leftTabs, index, updates);
      } else {
        set(state.rightTabs, index, updates);
      }
    },
    moveRightToLeft: (state, action: PayloadAction<MoveTabPayload>) => {
      const { tabId, dropIndex } = action.payload;
      const tab = state.rightTabs.find((tab) => tab.tabId === tabId);
      if (tab) {
        if (dropIndex !== undefined) {
          state.leftTabs.splice(dropIndex, 0, tab);
          state.currentLeftTabIndex = dropIndex;
          state.currentLeftTab = tabId;
        } else {
          state.leftTabs.push(tab);
          state.currentLeftTab = tabId;
          state.currentLeftTabIndex = state.leftTabs.length - 1;
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
      if (state.preventSplit) {
        return;
      }
      const tab = state.leftTabs.find((tab) => tab.tabId === tabId);
      if (tab) {
        if (dropIndex !== undefined) {
          state.rightTabs.splice(dropIndex, 0, tab);
          state.currentRightTabIndex = dropIndex;
          state.currentRightTab = tabId;
        } else {
          state.rightTabs.push(tab);
          state.currentRightTab = tabId;
          state.currentRightTabIndex = state.rightTabs.length - 1;
        }
        state.leftTabs = state.leftTabs.filter((tab) => tab.tabId !== tabId);
        state.splitTabs = true;

        if (state.leftTabs.length === 0 && state.rightTabs.length !== 0) {
          state.splitTabs = false;
          state.preventSplit = false;
          state.leftTabs = [...state.rightTabs];
          state.currentLeftTab = state.currentRightTab;
          state.currentLeftTabIndex = state.currentRightTabIndex;
          state.rightTabs = [];
          state.currentRightTab = null;
          state.currentRightTabIndex = null;
        }
        if (state.currentLeftTab === tabId) {
          state.currentLeftTab = state.leftTabs[0]?.tabId || null;
          state.currentLeftTabIndex = state.leftTabs[0] ? 0 : null;
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
    },
  },
});

export const {
  addTab,
  removeTab,
  setCurrentTab,
  setBreadcrumbs,
  updateTab,
  moveLeftToRight,
  moveRightToLeft,
  setToolOptions,
  setSplit,
  setPrevent,
} = sidePanelSlice.actions;

export default sidePanelSlice.reducer;
