import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useDrag } from 'react-dnd';

const DragWrapper = ({
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
          const targetIndex = monitor.getDropResult()?.hoverIndex;
          if (targetIndex !== undefined) {
            onReorder(draggedItem.index, targetIndex);
          }
        } else if (onDropEnd) {
          // Standard drop handling
          onDropEnd(draggedItem);
        }
      }
      endDrag(); // Reset context
    },
  }));

  return (
    <Box
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        display: 'inline-block',
        height: 'fit-content',
      }}
    >
      {children}
    </Box>
  );
};

export default DragWrapper;
