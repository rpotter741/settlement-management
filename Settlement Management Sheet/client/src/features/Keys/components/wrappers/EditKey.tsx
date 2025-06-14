import React, { useState, useEffect } from 'react';

import { Box, Typography, Divider, Chip } from '@mui/material';
import { useShellContext } from '@/context/ShellContext.js';
import { useTools } from 'hooks/useTools.jsx';
import { get } from 'lodash';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import KeyAutocomplete from '../forms/KeyAutocomplete.tsx';
import KeySettingsComp from '../forms/KeySettings.tsx';
import keyFields from '../../helpers/keyFormData.js';

const EditKey = () => {
  const { tool, id } = useShellContext();
  const { options } = useSidePanel();
  const { edit, updateTool } = useTools(tool, id);
  const [selectedKey, setSelectedKey] = useState(edit?.name || null);

  const handleAdd = (key) => {
    updateTool('name', key.name);
    setSelectedKey(key);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        py: 2,
      }}
    >
      <KeyAutocomplete onAdd={handleAdd} hideHelp={selectedKey !== null} />
      <Divider flexItem sx={{ mt: 6, mb: 4 }} />
      {edit?.name !== '' && <KeySettings selectedKey={selectedKey} />}
    </Box>
  );
};

export default EditKey;
