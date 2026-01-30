import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';

type UITypes = 'glossary' | 'event' | 'storyThread' | 'apt';

const initialState: Record<
  UITypes,
  {
    activeTab: string;
    lastTab: string | null;
    [key: string]: any;
  }
> = {
  glossary: {
    activeTab: 'Overview',
    lastTab: null,
    activeTermIndex: 0,
  },
  event: {
    activeTab: 'Overview',
    lastTab: null,
  },
  storyThread: {
    activeTab: 'Overview',
    lastTab: null,
  },
  apt: {
    activeTab: 'Overview',
    lastTab: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    updateConfigTab(
      state,
      action: {
        payload: { config: UITypes; activeTab: string };
      }
    ) {
      const { config, activeTab } = action.payload;
      if (state[config]) {
        state[config].activeTab = activeTab;
      }
    },
    updateLastTab(
      state,
      action: {
        payload: { config: UITypes; lastTab: string | null };
      }
    ) {
      const { config, lastTab } = action.payload;
      if (state[config]) {
        state[config].lastTab = lastTab;
      }
    },
    updateUIKey(
      state,
      action: PayloadAction<{ config: UITypes; key: string; value: any }>
    ) {
      const { config, key, value } = action.payload;
      if (state[config]) {
        state[config][key] = value;
      }
    },
  },
});

export const { updateConfigTab, updateLastTab, updateUIKey } = uiSlice.actions;

export default uiSlice.reducer;
