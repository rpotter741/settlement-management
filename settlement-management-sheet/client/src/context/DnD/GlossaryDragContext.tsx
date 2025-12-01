import { createContext, useContext } from 'react';
import { GlossaryEntryType, GlossaryNode } from 'types/glossaryEntry.js';
import { DragContextType, useDragProvider } from './GenericDrag.js';

const GlossaryDragContext = createContext<
  DragContextType<GlossaryNode, GlossaryEntryType>
>({
  isDragging: false,
  draggedType: null,
  draggedItem: null,
  startDrag: () => {},
  endDrag: () => {},
  lastDragged: null,
});

export const GlossaryDragProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const drag = useDragProvider<GlossaryNode, GlossaryEntryType>();

  return (
    <GlossaryDragContext.Provider value={drag}>
      {children}
    </GlossaryDragContext.Provider>
  );
};
export const useGlossaryDrag = () => {
  const context = useContext(GlossaryDragContext);
  if (!context) {
    throw new Error(
      'useGlossaryDrag must be used within a GlossaryDragProvider'
    );
  }
  return context;
};
