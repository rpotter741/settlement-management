import { createContext, useContext } from 'react';

export const PageBoxContext = createContext<any>(undefined);

export const usePageBoxContext = () => {
  const context = useContext(PageBoxContext);
  if (!context) {
    throw new Error('useShellContext must be used within a ToolProvider');
  }
  return context;
};
