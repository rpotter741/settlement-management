import { createContext, useContext } from 'react';
import { DragContextType, useDragProvider } from './GenericDrag.js';

const RangeOptionsDragContext = createContext<
  DragContextType<string, 'range-option'>
>({
  isDragging: false,
  draggedType: null,
  draggedItem: null,
  startDrag: () => {},
  endDrag: () => {},
  lastDragged: null,
});

export const RangeOptionsDragProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const drag = useDragProvider<string, 'range-option'>();

  return (
    <RangeOptionsDragContext.Provider value={drag}>
      {children}
    </RangeOptionsDragContext.Provider>
  );
};

export const useRangeOptionsDrag = () => {
  const context = useContext(RangeOptionsDragContext);
  if (!context) {
    throw new Error(
      'useRangeOptionsDrag must be used within a RangeOptionsDragProvider'
    );
  }
  return context;
};
