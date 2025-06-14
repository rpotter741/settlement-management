import React, { useState, useEffect } from 'react';

import { Box } from '@mui/material';
import { useTabDrag } from '@/context/DnD/TabDragContext.jsx';
import DropZone from '../DnD/DropZone.jsx';
import { Tab } from '@/app/types/SidePanelTypes.js';
import { TabDataPayload } from '@/app/types/ToolTypes.js';

interface TabDropBoxProps {
  side: 'left' | 'right';
  moveFn: (entry: TabDataPayload, dropIndex: number) => void;
}

const TabDropBox: React.FC<TabDropBoxProps> = ({ side, moveFn }) => {
  const { draggedType, endDrag } = useTabDrag();

  const sideStyle = {
    left: { left: 0 },
    right: { right: 0 },
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        width: '50%',
        height: '100%',
        opacity: 0.5,
        zIndex: 11,
        ...sideStyle[side],
      }}
    >
      <DropZone
        type={side === 'left' ? ['rightTab', 'anyTab'] : ['leftTab', 'anyTab']}
        handleAdd={(entry: TabDataPayload, index) => {
          moveFn(entry, index);
        }}
        onReorder={() => {}}
        bg1="rgba(100, 100, 100, 0.5)"
        bg2="rgba(255, 255, 255, 0.5)"
        defaultItems={[]}
        draggedType={draggedType}
        endDrag={endDrag}
      />
    </Box>
  );
};

export default TabDropBox;
