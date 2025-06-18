import ConfirmDelete from '@/features/Glossary/ConfirmDeleteEntry.js';
import NameNewGlossary from '@/features/Glossary/NameNewGlossary.js';
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
    () => import('../features/Glossary/NameNewGlossary.jsx')
  ),
  IconSelector: React.lazy(
    () => import('../components/shared/IconSelector/IconSelector.jsx')
  ),
  ConfirmDeleteEntry: React.lazy(
    () => import('../features/Glossary/ConfirmDeleteEntry.jsx')
  ),
  ConfirmDeleteGlossary: React.lazy(
    () => import('../features/Glossary/ConfirmDeleteGlossary.jsx')
  ),
};

export type ModalKey = keyof typeof modalMap;
