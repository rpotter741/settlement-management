import React from 'react';

import { Box, Typography } from '@mui/material';
import { useShellContext } from '@/context/ShellContext.js';
import { useTools } from 'hooks/useTools.jsx';
import { get } from 'lodash';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

const PreviewKey = ({ mode, side, tabId }) => {
  const { tool, id } = useShellContext();
  const { options } = useSidePanel();
  const { current } = useTools(tool, id);

  return (
    <Box>
      <Typography variant="h6">Key Preview</Typography>
      <Typography variant="body1">{current?.name}</Typography>
    </Box>
  );
};

export default PreviewKey;
