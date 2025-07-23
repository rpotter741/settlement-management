import { lazy } from 'react';

const contextKeyComponentMap = (props: Record<string, any>) => ({
  'Palette Settings': {
    component: lazy(
      () => import('../features/Glossary/forms/CustomizePalette.js')
    ),
    props: { ...props, column: true },
  },
  [`${props.name} Validation Checklist`]: {
    component: lazy(
      () => import('../features/Glossary/forms/CustomizePalette.js')
    ),
    props: { ...props },
  },
  'Search Tools': {
    component: lazy(
      () => import('../components/shared/LoadTool/SidePanelLoad.js')
    ),
    props: { ...props, tool: props.activeTool, displayName: props.displayName },
  },
});

export default contextKeyComponentMap;
