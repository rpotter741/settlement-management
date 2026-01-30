import React, { useState } from 'react';
import { Box, Autocomplete, TextField, Typography, Modal } from '@mui/material';
import { SketchPicker } from 'react-color';
import Icon from '../Icons/Icon.jsx';
import iconList from './iconList.jsx';

interface IconCustomizerProps {
  icons: Array<Icon>;
  onSelect?: ({ icon, color }: { icon: Icon; color: string }) => void;
}

interface Icon {
  name: string;
  viewBox: string;
  d: string;
}

const IconCustomizer: React.FC<IconCustomizerProps> = ({ icons, onSelect }) => {
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [color, setColor] = useState('#000000');

  const handleIconChange = (event: any, newValue: Icon) => {
    setSelectedIcon(newValue);
    if (onSelect) {
      onSelect({ icon: newValue, color });
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
    if (onSelect && selectedIcon) {
      onSelect({ icon: selectedIcon, color: newColor.hex });
    }
  };

  return (
    <Box>
      {/* Icon Selector */}
      <Box>
        <Autocomplete
          options={iconList}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
            >
              <Icon viewBox={option.viewBox} path={option.d} size={24} />
              <Typography>{option.name}</Typography>
            </Box>
          )}
          onChange={(e, newValue) =>
            newValue !== null ? handleIconChange(e, newValue) : () => {}
          }
          renderInput={(params) => (
            <TextField {...params} label="Select Icon" variant="outlined" />
          )}
        />
        {selectedIcon && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>Selected Icon:</Typography>
            <Icon
              viewBox={selectedIcon.viewBox}
              path={selectedIcon.d}
              size={24}
              color={color}
            />
            <Typography>({selectedIcon.name})</Typography>
          </Box>
        )}
      </Box>
      {/* Color Picker */}
      {selectedIcon && (
        <Box sx={{ mt: 2 }}>
          <Typography>Select Icon Color:</Typography>
          <SketchPicker color={color} onChangeComplete={handleColorChange} />
        </Box>
      )}
    </Box>
  );
};

export default IconCustomizer;
