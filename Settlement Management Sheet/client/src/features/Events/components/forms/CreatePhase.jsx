import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useTools } from 'hooks/useTool.tsx';
import { useToolContext } from 'context/ToolContext.jsx';

const CreatePhase = ({ phaseId }) => {
  const { id } = useToolContext();
  const { edit } = useTools('event', id);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: 'background.paper',
        height: '100%',
        position: 'relative',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      }}
      className="create-phase"
    >
      {/* Add your event editing components here */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ width: '100%' }}>
          Create Phase
        </Typography>
      </Box>
    </Box>
  );
};

export default CreatePhase;
