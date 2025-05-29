import { createContext, useContext } from 'react';

export const ToolContext = createContext();

export const useToolContext = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useToolContext must be used within a ToolProvider');
  }
  return context;
};
