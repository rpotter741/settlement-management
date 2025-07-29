import React, { createContext, useContext } from 'react';
import { tabSelectors as select } from '@/app/selectors/tabSelectors.js';
import { useSelector } from 'react-redux';
import { AddTabPayload, Tab } from '@/app/types/TabTypes.js';
import {
  addTab,
  removeTab,
  setCurrentTab,
  updateTab,
} from '@/app/slice/tabSlice.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';

interface TabsContextProps {
  tabs: Tab[];
  current: string | null;
  side: 'left' | 'right';
  setActiveTab: (index: number, tabId: string) => void;
  tabUpdate: (tabId: string, updates: Partial<Tab>, keypath: string) => void;
  tabRemove: (tabId: string, preventSplit?: boolean) => void;
  tabAdd: (AddTabPayload: AddTabPayload) => void;
}

interface TabsProviderProps {
  children: React.ReactNode;
}

const LeftTabsContext = createContext<TabsContextProps>({
  tabs: [],
  current: null,
  side: 'left',
  setActiveTab: () => {},
  tabUpdate: () => {},
  tabRemove: () => {},
  tabAdd: () => {},
});
const RightTabsContext = createContext<TabsContextProps>({
  tabs: [],
  current: null,
  side: 'right',
  setActiveTab: () => {},
  tabUpdate: () => {},
  tabRemove: () => {},
  tabAdd: () => {},
});

export const LeftTabsProvider: React.FC<TabsProviderProps> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();
  const tabs = useSelector(select.leftTabs);
  const current = useSelector(select.currentLeftTab);
  const side = 'left';
  const setActiveTab = (index: number, tabId: string) => {
    dispatch(setCurrentTab({ index, tabId, side }));
  };
  const tabUpdate = (tabId: string, updates: Partial<Tab>, keypath: string) => {
    dispatch(updateTab({ tabId, updates, keypath, side }));
  };
  const tabRemove = (tabId: string, preventSplit?: boolean) => {
    dispatch(removeTab({ tabId, side, preventSplit }));
  };
  const tabAdd = (tab: AddTabPayload) => {
    dispatch(addTab({ ...tab, side }));
  };
  return (
    <LeftTabsContext.Provider
      value={{
        tabs,
        current,
        side,
        setActiveTab,
        tabUpdate,
        tabRemove,
        tabAdd,
      }}
    >
      {children}
    </LeftTabsContext.Provider>
  );
};

export const RightTabsProvider: React.FC<TabsProviderProps> = ({
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const tabs = useSelector(select.rightTabs);
  const current = useSelector(select.currentRightTab);
  const side = 'right';
  const setActiveTab = (index: number, tabId: string) => {
    dispatch(setCurrentTab({ index, tabId, side }));
  };
  const tabUpdate = (tabId: string, updates: Partial<Tab>, keypath: string) => {
    dispatch(updateTab({ tabId, updates, keypath, side }));
  };
  const tabRemove = (tabId: string, preventSplit?: boolean) => {
    dispatch(removeTab({ tabId, side, preventSplit }));
  };
  const tabAdd = (tab: AddTabPayload) => {
    dispatch(addTab({ ...tab, side }));
  };
  return (
    <RightTabsContext.Provider
      value={{
        tabs,
        current,
        side,
        setActiveTab,
        tabUpdate,
        tabRemove,
        tabAdd,
      }}
    >
      {children}
    </RightTabsContext.Provider>
  );
};

export const useLeftTabs = () => {
  const context = useContext(LeftTabsContext);
  if (!context) {
    throw new Error('useLeftTabs must be used within a LeftTabsProvider');
  }
  return context;
};
export const useRightTabs = () => {
  const context = useContext(RightTabsContext);
  if (!context) {
    throw new Error('useRightTabs must be used within a RightTabsProvider');
  }
  return context;
};
