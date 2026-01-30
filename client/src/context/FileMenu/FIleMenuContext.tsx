import { createContext, useContext } from 'react';

export const FileMenuContext = createContext<any>(undefined);

export const useFileMenuContext = () => {
  const context = useContext(FileMenuContext);
  if (!context) {
    throw new Error('FileMenuContext must be used within a FileMenuProvider');
  }
  return context;
};
