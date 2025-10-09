import React, { useState } from 'react';
import { Box, ButtonGroup, Button } from '@mui/material';
import { HexColorPicker } from 'react-colorful';

interface IconColorPickerProps {
  onChange: (color: string) => void;
  sourceColor?: string;
  onBackgroundChange?: (color: string) => void;
  bgColor?: 'light' | 'dark';
}

const IconColorPicker: React.FC<IconColorPickerProps> = ({
  onChange,
  sourceColor = '#000',
  onBackgroundChange = () => {},
  bgColor = 'light',
}) => {
  const [color, setColor] = useState<string>(sourceColor);
  const [background, setBackground] = useState<string>(bgColor);
  const [mode, setMode] = useState<'icon' | 'background'>('icon');

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground);
    onBackgroundChange(newBackground);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  const handleChange = (newColor: string) => {
    if (mode === 'icon') {
      handleColorChange(newColor);
    } else {
      handleBackgroundChange(newColor);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <ButtonGroup
        variant="outlined"
        aria-label="outlined button group"
        sx={{ mb: 1 }}
      >
        <Button
          onClick={() => setMode('icon')}
          color="primary"
          variant={mode === 'icon' ? 'contained' : 'outlined'}
        >
          Icon
        </Button>
        <Button
          onClick={() => setMode('background')}
          color="secondary"
          variant={mode === 'background' ? 'contained' : 'outlined'}
        >
          Background
        </Button>
      </ButtonGroup>
      <HexColorPicker color={color} onChange={handleChange} />
    </Box>
  );
};

export default IconColorPicker;
