import React from 'react';

import { Box, Typography } from '@mui/material';
import { useToolContext } from 'context/ToolContext.jsx';
import { useTools } from 'hooks/useTool.jsx';
import { get } from 'lodash';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import KeyAutocomplete from '../forms/KeyAutocomplete.jsx';
import keyFields from '../../helpers/keyFormData.js';

const EditKey = () => {
  const { tool, id } = useToolContext();
  const { options } = useSidePanel();
  const { edit } = useTools(tool, id);
  const key = get(edit, 'key');

  React.useEffect(() => {
    console.log(edit, 'edit');
  }, [edit]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        py: 2,
      }}
    >
      <KeyAutocomplete onSelect={() => {}} />
    </Box>
  );
};

export default EditKey;
