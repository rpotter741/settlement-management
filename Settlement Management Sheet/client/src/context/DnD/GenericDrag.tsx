import React, { createContext, useContext, useState } from 'react';

export interface DragContextType<TItem = any, TType = string> {
  isDragging: boolean;
  draggedType: TType | null;
  draggedItem: TItem | null;
  startDrag: (type: TType, item: TItem) => void;
  endDrag: () => void;
  lastDragged: TItem | null;
}

export function useDragProvider<TItem, TType = string>() {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedType, setDraggedType] = useState<TType | null>(null);
  const [draggedItem, setDraggedItem] = useState<TItem | null>(null);
  const [lastDragged, setLastDragged] = useState<TItem | null>(null);

  const startDrag = (type: TType, item: TItem) => {
    console.log('startDrag', type, item);
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

  return {
    isDragging,
    draggedType,
    draggedItem,
    lastDragged,
    startDrag,
    endDrag,
  };
}
