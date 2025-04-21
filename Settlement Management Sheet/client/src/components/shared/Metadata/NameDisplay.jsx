import React from 'react';

import { Box, Typography } from '@mui/material';

const DataDisplay = ({ label, data, isLoading, edit, type = 'h6' }) => {
  return (
    <Box
      sx={{
        ...edit,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        gap: 2,
      }}
    >
      <Typography variant="h6">{label}:</Typography>
      <Typography variant={type}>{data || 'None'}</Typography>
    </Box>
  );
};

export default DataDisplay;
