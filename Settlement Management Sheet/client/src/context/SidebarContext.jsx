import React, { createContext, useContext } from 'react';

import { useSidePanel } from 'hooks/useSidePanel.jsx';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const sidePanel = useSidePanel();
  return (
    <>
      <SidebarContext.Provider value={sidePanel}>
        {children}
      </SidebarContext.Provider>
    </>
  );
};

export const useSidebar = () => useContext(SidebarContext);
