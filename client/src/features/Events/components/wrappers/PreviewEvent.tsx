import React, { useState } from 'react';
import { Box, Divider } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';

import { useTools } from 'hooks/tools/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import { useSidePanel } from 'hooks/global/useSidePanel.jsx';

const PreviewEvent = ({}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr', `repeat(3, 1fr)`],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'start',
        my: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      {/* Add your event editing components here */}
      I'm the PreviewEvent component!
    </Box>
  );
};

export default PreviewEvent;
