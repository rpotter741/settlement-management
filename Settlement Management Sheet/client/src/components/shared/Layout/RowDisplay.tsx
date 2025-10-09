import React from 'react';
import { Box, Typography } from '@mui/material';
import { capitalize } from 'lodash';

interface RowDisplayProps {
  name: string;
  value: string | number | React.ReactNode;
  style?: React.CSSProperties;
  even: boolean;
}

const RowDisplay: React.FC<RowDisplayProps> = ({
  name,
  value,
  style,
  even,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        backgroundColor: even ? 'background.default' : 'background.paper',
        ...style,
      }}
    >
      <Typography
        variant="body1"
        sx={{ fontWeight: 'bold', width: '100%', textAlign: 'start' }}
      >
        {capitalize(name)}:
      </Typography>
      <Typography sx={{ fontWeight: 'bold', position: 'absolute', right: 16 }}>
        {value}
      </Typography>
    </Box>
  );
};

export default RowDisplay;
