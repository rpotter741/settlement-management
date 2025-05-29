import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const Icon = ({
  viewBox,
  path,
  backgroundColor = 'transparent',
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
        <div style={{ backgroundColor }}>
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
        </div>
      </Card>
    );
  }

  // Default to box mode
  return (
    <Box
      sx={{
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        backgroundColor,
        borderRadius: '50%',
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
