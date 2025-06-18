import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { capitalize } from 'lodash';
import { useShellContext } from '@/context/ShellContext.js';

interface GlossaryDetailProps {
  keypath: string;
}

const GlossaryDetail: React.FC<GlossaryDetailProps> = ({ keypath }) => {
  const { entry } = useShellContext();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'start',
        mt: 2,
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Typography
        sx={{
          fontSize: '1.25rem',
          width: '100%',
          borderBottom: '1px solid',
          borderColor: 'divider',
          textAlign: 'left',
          fontWeight: 600,
        }}
      >
        {capitalize(keypath)}
      </Typography>
      <Typography
        sx={{
          fontSize: '1.1rem',
          width: '100%',
          textAlign: 'left',
          ml: 2,
        }}
      >
        {Array.isArray(entry[keypath])
          ? entry[keypath].map((option) => capitalize(option)).join(', ')
          : capitalize(entry[keypath]) || 'No data available'}
      </Typography>
    </Box>
  );
};

export default GlossaryDetail;
