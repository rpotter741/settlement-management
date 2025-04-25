import React, { useState } from 'react';
import { Box, Typography, Card, Button } from '@mui/material';
import Icon from '../Icons/Icon.jsx';
import iconList from './iconList';
import IconColorPicker from './IconColorPicker.jsx';
import { useTools } from 'hooks/useTool.jsx';

const IconSelector = ({ tool, setShowModal, id }) => {
  const { edit, updateTool } = useTools(tool, id);
  const [selectedIcon, setSelectedIcon] = useState(edit.icon);

  const handleIconChange = (event, newValue) => {
    setSelectedIcon(newValue);
    updateTool('icon', newValue);
  };

  const handleColorChange = (color) => {
    updateTool('iconColor', color);
  };

  const onConfirm = (icon, color) => {
    updateTool('icon', icon);
    updateTool('iconColor', color);
    setShowModal(null);
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
            color={edit.iconColor}
          />
        </Box>
        <IconColorPicker
          onChange={handleColorChange}
          sourceColor={edit.iconColor}
        />
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
                  color={edit.iconColor}
                />
              </Button>
            </Card>
          )
      )}
      <Button
        variant="contained"
        sx={{ gridColumn: 'span 6', mt: 2 }}
        onClick={() => onConfirm(selectedIcon, edit.iconColor)}
      >
        Confirm
      </Button>
    </Box>
  );
};

export default IconSelector;
