import { createSlice } from '@reduxjs/toolkit';
import { setKeypathValue as set } from 'utility/setKeypathValue.js';

import CreateAttribute from 'features/Attributes/components/wrappers/CreateAttribute.jsx';

const initialState = {
  tabs: [],
  currentTab: null,
  currentTabIndex: null,
  breadcrumbs: [],
};

const sidePanelSlice = createSlice({
  name: 'sidePanel',
  initialState,
  reducers: {
    addTab: (state, action) => {
      const { name, mode, id, type, tabId, scroll, activate } = action.payload;
      console.log('activate', activate);
      state.tabs.push({ name, id, mode, type, tabId, scroll });
      if (activate) {
        state.currentTabIndex = state.tabs.length - 1;
        state.currentTab = tabId;
      }
    },
    removeTab: (state, action) => {
      const { tabId } = action.payload;
      state.tabs = state.tabs.filter((tab) => tab.tabId !== tabId);
      if (state.currentTab === tabId) {
        state.currentTab = state.tabs[0]?.tabId || null;
        state.currentTabIndex = state.tabs[0] ? 0 : null;
      }
    },
    setCurrentTab: (state, action) => {
      const { index, tabId } = action.payload;
      state.currentTabIndex = index;
      state.currentTab = tabId;
    },
    setBreadcrumbs: (state, action) => {
      const { breadcrumbs } = action.payload;
      state.breadcrumbs = breadcrumbs;
    },
    updateTab: (state, action) => {
      const { index, updates } = action.payload;
      if (state.tabs[index]) {
        set(state.tabs[index], updates);
      }
    },
  },
});

export const { addTab, removeTab, setCurrentTab, setBreadcrumbs, updateTab } =
  sidePanelSlice.actions;

export default sidePanelSlice.reducer;
