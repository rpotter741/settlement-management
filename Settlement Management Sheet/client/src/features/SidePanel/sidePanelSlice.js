import { createSlice } from '@reduxjs/toolkit';
import { setKeypathValue as set } from 'utility/setKeypathValue.js';

import CreateAttribute from 'features/Attributes/components/wrappers/CreateAttribute.jsx';

const initialState = {
  leftTabs: [],
  rightTabs: [],
  splitTabs: false,
  preventSplit: false,
  currentLeftTab: null,
  currentRightTab: null,
  currentLeftTabIndex: null,
  currentRightTabIndex: null,
  breadcrumbs: [],
};

const sidePanelSlice = createSlice({
  name: 'sidePanel',
  initialState,
  reducers: {
    addTab: (state, action) => {
      const {
        name,
        mode,
        id,
        type,
        tabId,
        scroll,
        activate,
        side = 'left',
      } = action.payload;
      const entry = { name, id, mode, type, tabId, scroll };
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
    },
    removeTab: (state, action) => {
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
    setCurrentTab: (state, action) => {
      const { index, tabId, side = 'left' } = action.payload;
      if (side === 'left' || state.preventSplit) {
        state.currentLeftTabIndex = index;
        state.currentLeftTab = tabId;
      } else {
        state.currentRightTabIndex = index;
        state.currentRightTab = tabId;
      }
    },
    setBreadcrumbs: (state, action) => {
      const { breadcrumbs } = action.payload;
      state.breadcrumbs = breadcrumbs;
    },
    updateTab: (state, action) => {
      const { index, side, updates } = action.payload;
      if (side === 'left' || state.preventSplit) {
        set(state.leftTabs[index], updates);
      } else {
        set(state.rightTabs[index], updates);
      }
    },
    moveRightToLeft: (state, action) => {
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

        console.log('newTabs', newTabs);

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
    moveLeftToRight: (state, action) => {
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
        state.isSplit = true;

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
} = sidePanelSlice.actions;

export default sidePanelSlice.reducer;
