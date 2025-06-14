import React, { createContext, useContext } from 'react';

import { useSidePanel } from '@/hooks/useSidePanel.jsx';

const SidebarContext = createContext<
  ReturnType<typeof useSidePanel> | undefined
>(undefined);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
