import EntriesChildrenModMenu from '@/features/Glossary/Modals/EntriesChildrenModMenu.js';
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
  ConfirmMultipleDeleteEntries: React.lazy(
    () => import('../features/Glossary/Modals/ConfirmMultipleDeleteEntries.js')
  ),
  ConfirmDeleteGlossary: React.lazy(
    () => import('../features/Glossary/Modals/ConfirmDeleteGlossary.js')
  ),
  EntriesChildrenModMenu: React.lazy(
    () => import('../features/Glossary/Modals/EntriesChildrenModMenu.js')
  ),
  NameNewSubType: React.lazy(
    () => import('../features/Glossary/Modals/NameNewSubType.js')
  ),
  DeleteSubTypeConfirmation: React.lazy(
    () => import('../features/Glossary/Modals/ConfirmDeleteSubType.js')
  ),
  CreateGlossaryEntryFromDropdown: React.lazy(
    () =>
      import('../features/Glossary/Modals/CreateGlossaryEntryFromDropdown.js')
  ),
  ConfirmChangeEntrySubType: React.lazy(
    () => import('../features/Glossary/Modals/ConfirmChangeSubType.js')
  ),
  EditSmartSyncRule: React.lazy(
    () => import('../features/Glossary/Modals/EditSmartSyncRule.js')
  ),
  ReviewSyncChanges: React.lazy(
    () => import('../features/SyncWorkspace/ReviewSyncChanges.js')
  ),
  AdHocSmartLink: React.lazy(
    () => import('../features/Glossary/Modals/AdHocSmartLinkModal.js')
  ),
};

export type ModalKey = keyof typeof modalMap;
