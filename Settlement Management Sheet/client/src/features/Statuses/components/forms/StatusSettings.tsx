import React from 'react';
import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import { Box, Divider } from '@mui/material';
import ToolSelect from 'components/shared/DynamicForm/ToolSelect.jsx';

const StatusSettings = () => {
  const { tool, id } = useShellContext();
  const { edit, updateTool } = useTools(tool, id);

  return (
    <Box
      sx={{
        gridColumn: 'span 3',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <ToolSelect
        label="Status Type"
        options={['Weather', 'Morale', 'Settlement']}
        keypath="type"
      />
      <ToolSelect
        label="Creation Mode"
        keypath="mode"
        options={['Simple', 'Advanced']}
      />
    </Box>
  );
};

export default StatusSettings;
