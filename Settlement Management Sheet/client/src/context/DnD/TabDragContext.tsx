import { createContext, useState, useContext } from 'react';

import { Tab } from '@/app/types/SidePanelTypes.js';
import { DragContextType, useDragProvider } from './GenericDrag.js';

type TabTypes = 'leftTab' | 'rightTab';

const TabDragContext = createContext<DragContextType<Tab, TabTypes>>({
  isDragging: false,
  draggedType: null,
  draggedItem: null,
  startDrag: () => {},
  endDrag: () => {},
  lastDragged: null,
});

export const TabDragProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const drag = useDragProvider<Tab, TabTypes>();

  return (
    <TabDragContext.Provider value={drag}>{children}</TabDragContext.Provider>
  );
};

export const useTabDrag = () => {
  const context = useContext(TabDragContext);
  if (!context) {
    throw new Error('useTabDrag must be used within a TabDragProvider');
  }
  return context;
};
