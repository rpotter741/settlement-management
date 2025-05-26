import { createContext, useState, useContext } from 'react';

import { Tab } from '../../features/SidePanel/types';
import { DragContextType, useDragProvider } from './GenericDrag';

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
