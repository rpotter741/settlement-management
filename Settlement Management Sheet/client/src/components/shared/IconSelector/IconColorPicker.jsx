import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { HexColorPicker } from 'react-colorful';

const IconColorPicker = ({ onChange, sourceColor = '#000000' }) => {
  const [color, setColor] = useState(sourceColor);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <HexColorPicker color={color} onChange={handleColorChange} />
    </Box>
  );
};

export default IconColorPicker;
