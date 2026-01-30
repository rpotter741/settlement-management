import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Box } from '@mui/material';
import { DropResult } from './DragWrapper.js';
import { TabDataPayload } from '@/app/types/ToolTypes.js';
import { border } from '@mui/system';
import { alpha, useTheme } from '@mui/material/styles';
import getDropStyle from './getDropStyle.js';

export type DropZoneStyleType = 'tabs' | 'glossary' | 'columns' | 'default';

interface DropZoneProps {
  type: string[]; // Type for the DropZone
  children?: React.ReactNode;
  handleAdd: (item: any, index: number) => void; // Function to handle adding items
  onReorder?: (item: any, hoverIndex: number) => void; // Optional reordering function
  onAbsolutePlacement?: (item: any) => void; // Optional absolute placement function
  defaultItems?: any[]; // Default items to display
  bg2?: string; // Background color when hovered
  bg1?: string; // Default background color
  draggedType?: string | null; // Type of the currently dragged item
  endDrag?: () => void; // Function to reset drag context
  styleType?: DropZoneStyleType; // Optional style type for the drop zone
  index?: number; // Optional index for ordering
}

const DropZone: React.FC<DropZoneProps> = ({
  type,
  children,
  handleAdd,
  onReorder,
  onAbsolutePlacement,
  defaultItems,
  bg2 = 'background.paper',
  bg1 = 'background.default',
  draggedType = null,
  endDrag = () => {},
  styleType = 'tabs', // Default style type
  index = 0,
}) => {
  const [droppedItems, setDroppedItems] = useState(defaultItems);
  const theme = useTheme();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    hover: (item, monitor) => {
      const hoverIndex = (monitor.getDropResult() as DropResult)?.hoverIndex;

      if (onReorder && hoverIndex !== undefined) {
        onReorder(item, hoverIndex); // Trigger reordering logic
      }
    },
    drop: (item: unknown, monitor) => {
      const castItem = item as Record<string, any>;
      const offset = monitor.getClientOffset();
      const hoverIndex = (monitor.getDropResult() as DropResult)?.hoverIndex;

      if (onReorder && hoverIndex !== undefined) {
        onReorder(castItem, hoverIndex); // Trigger reordering logic
      } else if (onAbsolutePlacement && offset) {
        const newItem = {
          ...castItem,
          x: offset.x,
          y: offset.y,
        };
        setDroppedItems((prev = []) => [...prev, newItem]); // Add the dropped item
        onAbsolutePlacement(newItem); // Trigger absolute placement logic
      } else {
        if (defaultItems) {
          setDroppedItems((prev = []) => [...prev, castItem]);
        }
        handleAdd(castItem, hoverIndex || 0); // Add the dropped item
      }
      endDrag(); // Reset drag context
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {}, [isOver, draggedType]);

  useEffect(() => {
    defaultItems && setDroppedItems(defaultItems); // Synchronize with defaults
  }, [defaultItems]);

  return (
    <Box
      ref={drop}
      sx={getDropStyle({
        key: styleType,
        type,
        draggedType,
        bg2,
        bg1,
        isOver,
        alpha,
        theme,
      })}
    >
      {children}
    </Box>
  );
};

export default DropZone;
