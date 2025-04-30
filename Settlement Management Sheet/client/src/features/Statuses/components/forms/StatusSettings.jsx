import React from 'react';
import { useTools } from 'hooks/useTool.jsx';
import { useToolContext } from 'context/ToolContext.jsx';
import { Box, Divider } from '@mui/material';
import SelectOptions from 'components/shared/Select/SelectOptions.jsx';

const StatusSettings = () => {
  const { tool, id } = useToolContext();
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
      <SelectOptions
        label="Status Type"
        value={edit.type}
        onChange={(e) => updateTool('type', e.target.value)}
        options={['Weather', 'Morale', 'Settlement']}
      />
      <SelectOptions
        label="Creation Mode"
        value={edit.mode}
        onChange={(e) => updateTool('mode', e.target.value)}
        options={['Simple', 'Advanced']}
      />
    </Box>
  );
};

export default StatusSettings;
