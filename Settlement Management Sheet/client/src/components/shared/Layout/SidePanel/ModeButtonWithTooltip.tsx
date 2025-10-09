import React from 'react';
import { Tooltip, IconButton, Typography } from '@mui/material';
import { capitalize } from 'lodash';
import { Box } from '@mui/system';
import { Mode } from '@/features/SidePanel/SidePanel.js';

interface ModeButtonWithTooltipProps {
  index: number;
  modeTarget: Mode;
  setMode: (mode: Mode) => void;
  icon: React.ElementType;
  arrowPlacement?: 'left' | 'right' | 'top' | 'bottom';
  height?: number;
  width?: number;
  active?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

const ModeButtonWithTooltip: React.FC<ModeButtonWithTooltipProps> = ({
  index,
  modeTarget,
  setMode,
  icon,
  arrowPlacement = 'right',
  height = 48,
  width = 48,
  active = false,
  activeColor = 'success.main',
  inactiveColor = 'warning.light',
}) => {
  const calculatedColor = active ? activeColor : inactiveColor;
  const props = {
    sx: {
      color: calculatedColor,
    },
  };
  return (
    <Box
      sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Tooltip
        title={<Typography>{modeTarget}</Typography>}
        arrow
        placement={arrowPlacement}
      >
        <IconButton
          sx={{
            border: 0,
            borderRadius: 0,
            height,
            width,
          }}
          onClick={() => setMode(modeTarget)}
        >
          {React.createElement(icon, props)}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ModeButtonWithTooltip;
