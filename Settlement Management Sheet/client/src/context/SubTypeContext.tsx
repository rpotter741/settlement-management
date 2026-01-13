import { createContext, useContext } from 'react';

export const SubTypeContext = createContext<any>(undefined);

export const useSubTypeContext = () => {
  const context = useContext(SubTypeContext);
  if (!context) {
    throw new Error('useSubTypeContext must be used within a SubTypeProvider');
  }
  return context;
};
