import React, { useState } from 'react';
import { Box, Typography, TextField, Select } from '@mui/material';
import { useToolContext } from 'context/ToolContext.jsx';
import { useTools } from 'hooks/useTool.jsx';

import DynamicForm from 'components/shared/DynamicForm/DynamicForm.jsx';

const KeySettings = () => {
  const { tool, id } = useToolContext();
  const { options } = useSidePanel();
  const { edit } = useTools(tool, id);

  return (
    <Box>
      <Typography variant="h6">Key Settings</Typography>
      <Box
        sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}
      >
        <Typography sx={{ width: '50%' }} variant="body1">
          Delay:
        </Typography>
        <TextField sx={{ width: '50%' }} type="number" value={edit?.delay} />
      </Box>
    </Box>
  );
};

export default KeySettings;
