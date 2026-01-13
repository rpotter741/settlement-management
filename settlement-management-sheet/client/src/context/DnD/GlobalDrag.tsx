import React, { createContext, useContext, useState } from 'react';

interface GlobalDragContextType {
  isDragging: boolean;
  draggedType: string | null;
  draggedItem: any;
  startDrag: (type: string, item: any, id: string) => void;
  endDrag: () => void;
  lastDragged: any;
  draggedId: string | null;
  hoverId: string | null;
  setHoverId: (id: string | null) => void;
}

// registry is a map of drag types to sets of hook ids, enabling multiple components to register for the same drag type and respond to drag events
interface DragAcceptRegistry {
  [key: string]: Set<string>;
}

export const GlobalDragContext = createContext<
  GlobalDragContextType | undefined
>(undefined);

export const DragProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [lastDragged, setLastDragged] = useState<any>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const startDrag = (type: string, item: any, id: string) => {
    setIsDragging(true);
    setDraggedId(id);
    setDraggedType(type);
    setDraggedItem(item);
    setLastDragged(item);
  };

  const endDrag = () => {
    setIsDragging(false);
    setDraggedType(null);
    setDraggedItem(null);
    setDraggedId(null);
  };

  return (
    <GlobalDragContext.Provider
      value={{
        isDragging,
        draggedType,
        draggedItem,
        startDrag,
        endDrag,
        lastDragged,
        draggedId,
        hoverId,
        setHoverId,
      }}
    >
      {children}
    </GlobalDragContext.Provider>
  );
};

export const useGlobalDragContext = (): GlobalDragContextType => {
  const context = useContext(GlobalDragContext);
  if (!context) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context as GlobalDragContextType;
};
