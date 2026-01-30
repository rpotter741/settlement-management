import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';

interface IconProps {
  viewBox: string;
  path: string;
  backgroundColor?: string;
  size?: number;
  color?: string;
  mode?: 'box' | 'card' | 'preview'; // 'box' for small icon, 'card' for larger icon with label
  label?: string; // Optional label for card mode
  padding?: number; // Padding for the box mode
  borderRadius?: string | number; // Border radius for the box mode
  onClick?: () => void; // Click handler for the icon
}

const Icon: React.FC<IconProps> = ({
  viewBox,
  path,
  backgroundColor = 'transparent',
  size = 24,
  color = 'currentColor',
  mode = 'box', // Default mode: 'box', can also be 'card'
  label = undefined,
  padding = 1,
  borderRadius = 2,
  onClick,
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
            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
              {label}
            </Typography>
          )}
        </div>
      </Card>
    );
  }

  if (mode === 'preview') {
    return (
      <Box
        sx={{
          p: padding,
          display: 'flex',
          alignItems: 'center',
          backgroundColor,
          borderRadius,
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
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
  }

  // Default to box mode
  return (
    <IconButton
      size="small"
      disabled={!!!onClick}
      onClick={onClick}
      tabIndex={!!onClick ? 0 : -1} // Make it focusable only if onClick is provided
      sx={{
        p: padding,
        display: 'flex',
        alignItems: 'center',
        backgroundColor,
        borderRadius,
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
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
    </IconButton>
  );
};

export default Icon;
