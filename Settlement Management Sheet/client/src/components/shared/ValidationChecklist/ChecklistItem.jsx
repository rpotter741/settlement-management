import React from 'react';
import { Box, Typography } from '@mui/material';

import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';

const ChecklistItem = ({ error, label, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 1,
        alignItems: 'center',
        justifyContent: 'start',
        ...props.sx,
      }}
    >
      {error ? <WarningIcon color="error" /> : <CheckIcon color="success" />}
      <Typography
        noWrap
        sx={{
          textOverflow: 'hidden',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontWeight: 'bold',
          ...props.labelSx,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default ChecklistItem;
