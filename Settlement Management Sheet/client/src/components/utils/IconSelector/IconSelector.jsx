import React, { useState } from 'react';
import { Box, Typography, Card, Button } from '@mui/material';
import Icon from '../Icons/Icon.jsx';
import iconList from './iconList';
import IconColorPicker from './IconColorPicker.jsx';

const IconSelector = ({
  initialIcon,
  onSelect,
  color,
  setColor,
  onConfirm,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);

  const handleIconChange = (event, newValue) => {
    setSelectedIcon(newValue);
    if (onSelect) {
      onSelect(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        gridTemplateColumns: 'repeat(6, 1fr)',
        width: '100%',
        minWidth: ['100%', 800],
      }}
    >
      <Box
        sx={{
          my: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: 1,
          gridColumn: 'span 6',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'column',
          }}
        >
          <Typography>Selected Icon:</Typography>
          <Icon
            viewBox={selectedIcon.viewBox}
            path={selectedIcon.d}
            size={48}
            color={color}
          />
        </Box>
        <IconColorPicker onChange={setColor} sourceColor={color} />
      </Box>
      {iconList.map(
        (icon, index) =>
          icon.name !== selectedIcon.name && (
            <Card
              key={index}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button
                onClick={() => handleIconChange(null, icon)}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: ['60px', '80px', '100px'],
                  height: ['60px', '80px', '100px'],
                }}
              >
                <Icon
                  viewBox={icon.viewBox}
                  path={icon.d}
                  size={48}
                  color={color}
                />
              </Button>
            </Card>
          )
      )}
      <Button
        variant="contained"
        sx={{ gridColumn: 'span 6', mt: 2 }}
        onClick={() => onConfirm(selectedIcon, color)}
      >
        Confirm
      </Button>
    </Box>
  );
};

export default IconSelector;
