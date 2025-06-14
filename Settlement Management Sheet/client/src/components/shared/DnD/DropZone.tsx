import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Box } from '@mui/material';
import { DropResult } from './DragWrapper.js';
import { TabDataPayload } from '@/app/types/ToolTypes.js';
import { border } from '@mui/system';
import { alpha, useTheme } from '@mui/material/styles';

type DropZoneStyleType = 'tabs' | 'glossary';

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
}) => {
  const [droppedItems, setDroppedItems] = useState(defaultItems);
  const theme = useTheme();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: (item: Record<string, any>, monitor) => {
      const offset = monitor.getClientOffset();
      const hoverIndex = (monitor.getDropResult() as DropResult)?.hoverIndex;
      if (onReorder && hoverIndex !== undefined) {
        onReorder(item, hoverIndex); // Trigger reordering logic
      } else if (onAbsolutePlacement && offset) {
        const newItem = {
          ...item,
          x: offset.x,
          y: offset.y,
        };
        setDroppedItems((prev = []) => [...prev, newItem]); // Add the dropped item
        onAbsolutePlacement(newItem); // Trigger absolute placement logic
      } else {
        if (defaultItems) {
          setDroppedItems((prev = []) => [...prev, item]);
        }
        handleAdd(item, hoverIndex || 0); // Add the dropped item
      }
      endDrag(); // Reset drag context
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    defaultItems && setDroppedItems(defaultItems); // Synchronize with defaults
  }, [defaultItems]);

  const dropStyleMap = {
    tabs: {
      position: 'relative',
      border: type.includes(draggedType || '') ? '2px dashed #ccc' : '',
      backgroundColor: isOver ? bg2 : 'inherit',
      pt: 0,
      height: '100%',
      borderRadius: 4,
      zIndex: 1000,
      boxSizing: 'border-box',
    },
    glossary: {
      position: 'relative',
      borderTop: '2px solid',
      borderColor: isOver
        ? 'primary.main'
        : type.includes(draggedType || '')
          ? alpha(theme.palette.primary.light, 0.25)
          : 'transparent',
      backgroundColor: isOver
        ? alpha(theme.palette.success.main, 0.5)
        : type.includes(draggedType || '')
          ? alpha(theme.palette.success.main, 0.0625)
          : 'inherit',

      pt: 0,
      height: '100%',
      borderRadius: 0,
      zIndex: 1000,
      boxSizing: 'border-box',
    },
  };

  return (
    <Box
      ref={drop}
      sx={
        dropStyleMap[styleType] ?? {
          position: 'relative',
          border: type.includes(draggedType || '') ? '2px dashed #ccc' : '',
          backgroundColor: isOver ? bg2 : 'inherit',
          pt: 0,
          height: '100%',
          borderRadius: 4,
          zIndex: 1000,
          boxSizing: 'border-box',
          boxShadow: isOver ? `5px 5px 10px red` : 'none',
        }
      }
    >
      {children}
    </Box>
  );
};

export default DropZone;
