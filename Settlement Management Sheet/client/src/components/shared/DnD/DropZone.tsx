import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Box } from '@mui/material';

const DropZone = ({
  type,
  children,
  handleAdd,
  onReorder,
  onAbsolutePlacement,
  defaultItems = [],
  bg2 = 'background.paper',
  bg1 = 'background.default',
  draggedType = null,
  endDrag = () => {},
}) => {
  const [droppedItems, setDroppedItems] = useState(defaultItems);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const hoverIndex = monitor.getDropResult()?.hoverIndex;
      if (onReorder && hoverIndex !== undefined) {
        onReorder(item, hoverIndex); // Trigger reordering logic
      } else if (onAbsolutePlacement && offset) {
        const newItem = {
          ...item,
          x: offset.x,
          y: offset.y,
        };
        setDroppedItems((prev) => [...prev, newItem]); // Add the dropped item
        onAbsolutePlacement(newItem); // Trigger absolute placement logic
      } else {
        setDroppedItems((prev) => [...prev, item]);
        handleAdd(item); // Add the dropped item
      }
      endDrag(); // Reset drag context
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    setDroppedItems(defaultItems); // Synchronize with defaults
  }, [defaultItems]);

  return (
    <Box
      ref={drop}
      sx={{
        position: 'relative',
        minHeight: '200px',
        border: draggedType === type ? '2px dashed #ccc' : '',
        backgroundColor: isOver ? bg2 : bg1,
        p: 3,
        pt: 0,
        textAlign: 'center',
        height: '100%',
        borderRadius: 4,
        zIndex: 1000,
      }}
    >
      {children}
    </Box>
  );
};

export default DropZone;
