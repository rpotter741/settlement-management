import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const Icon = ({
  viewBox,
  path,
  size = 24,
  color = 'currentColor',
  mode = 'box', // Default mode: 'box', can also be 'card'
  label,
}) => {
  if (mode === 'card') {
    return (
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 2,
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
        }}
      >
        <CardContent>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            width={size}
            height={size}
            fill={color}
          >
            <path d={path} />
          </svg>
          {label && (
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {label}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default to box mode
  return (
    <Box
      sx={{
        display: 'inline-block',
        p: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={size}
        height={size}
        fill={color}
      >
        <path d={path} />
      </svg>
    </Box>
  );
};

export default Icon;
