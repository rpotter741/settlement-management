import React, { createContext, useContext } from 'react';
import { sidePanelSelectors as select } from 'features/SidePanel/sidePanelSelectors.js';
import { useSelector } from 'react-redux';

const LeftTabsContext = createContext();
const RightTabsContext = createContext();

export const LeftTabsProvider = ({ children }) => {
  const tabs = useSelector(select.leftTabs);
  const current = useSelector(select.currentLeftTab);
  return (
    <LeftTabsContext.Provider value={{ tabs, current }}>
      {children}
    </LeftTabsContext.Provider>
  );
};

export const RightTabsProvider = ({ children }) => {
  const tabs = useSelector(select.rightTabs);
  const current = useSelector(select.currentRightTab);
  return (
    <RightTabsContext.Provider value={{ tabs, current }}>
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
