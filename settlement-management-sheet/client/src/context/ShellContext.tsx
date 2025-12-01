import { createContext, useContext } from 'react';

export const ShellContext = createContext<any>(undefined);

export const useShellContext = () => {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error('useShellContext must be used within a ToolProvider');
  }
  return context;
};
