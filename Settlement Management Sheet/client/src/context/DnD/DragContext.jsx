import React, { createContext, useContext, useState } from 'react';

const DragContext = createContext();

export const DragProvider = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedType, setDraggedType] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [lastDragged, setLastDragged] = useState(null);

  const startDrag = (type, item) => {
    setIsDragging(true);
    setDraggedType(type);
    setDraggedItem(item);
    setLastDragged(item);
  };

  const endDrag = () => {
    setIsDragging(false);
    setDraggedType(null);
    setDraggedItem(null);
  };

  return (
    <DragContext.Provider
      value={{
        isDragging,
        draggedType,
        draggedItem,
        startDrag,
        endDrag,
        lastDragged,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};

export const useDragContext = () => useContext(DragContext);
