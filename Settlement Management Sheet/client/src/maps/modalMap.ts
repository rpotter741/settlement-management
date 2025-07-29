import React from 'react';

export const modalMap: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  ConfirmDirtyClose: React.lazy(
    () => import('../components/shared/TabbedContainer/ConfirmDirtyClose.jsx')
  ),
  QuickSearch: React.lazy(
    () => import('../components/shared/LoadTool/QuickSearch.jsx')
  ),
  NameNewGlossary: React.lazy(
    () => import('../features/Glossary/Modals/NameNewGlossary.jsx')
  ),
  IconSelector: React.lazy(
    () => import('../components/shared/IconSelector/IconSelector.jsx')
  ),
  ConfirmDeleteEntry: React.lazy(
    () => import('../features/Glossary/Modals/ConfirmDeleteEntry.js')
  ),
  ConfirmDeleteGlossary: React.lazy(
    () => import('../features/Glossary/Modals/ConfirmDeleteGlossary.js')
  ),
};

export type ModalKey = keyof typeof modalMap;
