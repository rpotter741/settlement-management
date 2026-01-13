import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDrag } from 'react-dnd';

interface DragWrapperProps {
  type: string;
  item: any; // Define a more specific type if possible
  children: React.ReactNode;
  onDropEnd?: (item: { id: string; name: string }, index: number) => void; // Callback when drag ends
  onReorder?: (fromIndex: number, toIndex: number) => void; // Callback for reordering
  index?: number | null; // Optional index for reordering
  startDrag?: (type: any, item: any) => void; // Callback to set context when drag starts
  endDrag?: () => void; // Callback to reset context when drag ends
  [key: string]: any; // Allow additional props
}

export interface DropResult {
  hoverIndex?: number;
  [key: string]: any; // Allow additional properties in drop result
}

const DragWrapper: React.FC<DragWrapperProps> = ({
  type,
  item,
  children,
  onDropEnd,
  onReorder,
  index = null,
  startDrag = () => {},
  endDrag = () => {},
  ...props
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: () => {
      startDrag(type, item); // Set context
      return { ...item, index }; // Include index for reordering
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (draggedItem, monitor) => {
      if (monitor.didDrop()) {
        if (onReorder && draggedItem.index !== null) {
          // Reorder-specific handling
          const targetIndex = (monitor.getDropResult() as DropResult)
            ?.hoverIndex;
          if (targetIndex !== undefined) {
            onReorder(draggedItem.index, targetIndex);
          }
        } else if (onDropEnd) {
          // Standard drop handling
          onDropEnd(draggedItem, draggedItem.index || 0);
        }
      }
      endDrag(); // Reset context
    },
  }));

  return (
    <Box
      className="drag-wrapper"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        height: 'fit-content',
      }}
    >
      {children}
    </Box>
  );
};

export default DragWrapper;
