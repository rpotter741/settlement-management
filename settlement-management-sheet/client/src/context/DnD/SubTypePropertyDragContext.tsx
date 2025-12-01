import { createContext, useContext } from 'react';
import { DragContextType, useDragProvider } from './GenericDrag.js';

const SubTypePropertyDragContext = createContext<
  DragContextType<string, 'sub-type-property' | 'sub-type-group'>
>({
  isDragging: false,
  draggedType: null,
  draggedItem: null,
  startDrag: () => {},
  endDrag: () => {},
  lastDragged: null,
});

export const SubTypePropertyDragProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const drag = useDragProvider<
    string,
    'sub-type-property' | 'sub-type-group'
  >();

  return (
    <SubTypePropertyDragContext.Provider value={drag}>
      {children}
    </SubTypePropertyDragContext.Provider>
  );
};

export const useSubTypePropertyDrag = () => {
  const context = useContext(SubTypePropertyDragContext);
  if (!context) {
    throw new Error(
      'useSubTypePropertyDrag must be used within a SubTypePropertyDragProvider'
    );
  }
  return context;
};
