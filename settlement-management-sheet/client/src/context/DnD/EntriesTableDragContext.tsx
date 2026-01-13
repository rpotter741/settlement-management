import { EntriesViewerColumnState } from '@/features/Glossary/Entries/useEntriesViewer.js';
import { createContext, useContext } from 'react';
import { DragContextType, useDragProvider } from './GenericDrag.js';

const EntriesTableDragContext = createContext<
  DragContextType<EntriesViewerColumnState, 'entries-column'>
>({
  isDragging: false,
  draggedType: null,
  draggedItem: null,
  startDrag: () => {},
  endDrag: () => {},
  lastDragged: null,
});

export const EntriesTableDragProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const drag = useDragProvider<EntriesViewerColumnState, 'entries-column'>();

  return (
    <EntriesTableDragContext.Provider value={drag}>
      {children}
    </EntriesTableDragContext.Provider>
  );
};

export const useEntriesTableDrag = () => {
  const context = useContext(EntriesTableDragContext);
  if (!context) {
    throw new Error(
      'useEntriesTableDrag must be used within a EntriesTableDragProvider'
    );
  }
  return context;
};
