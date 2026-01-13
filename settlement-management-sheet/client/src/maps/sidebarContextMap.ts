import React, { lazy } from 'react';

const sidebarContextMap = {
  'Search Tools': () =>
    React.memo(
      lazy(() => import('@/components/shared/LoadTool/SidePanelLoad.js'))
    ),
  'Glossary Settings': () =>
    React.memo(
      lazy(() => import('@/features/SidePanel/Glossary/GlossaryNavList.js'))
    ),
  'Glossary SubTypes': () =>
    React.memo(
      lazy(
        () =>
          import(
            '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js'
          )
      )
    ),
};

export default sidebarContextMap;
