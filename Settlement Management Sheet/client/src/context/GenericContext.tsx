import { createContext, useContext } from 'react';

export function createGenericContext<T>() {
  const context = createContext<T | undefined>(undefined);

  const useCtx = () => {
    const ctx = useContext(context);
    if (!ctx) throw new Error('Context must be used within its provider');
    return ctx;
  };

  return [context.Provider, useCtx] as const;
}

export const GenericContext = createContext<any>(undefined);

export const useGenericContext = () => {
  const context = useContext(GenericContext);
  if (!context) {
    throw new Error('useGenericContext must be used within its provider');
  }
  return context;
};
