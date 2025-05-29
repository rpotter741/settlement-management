import React, { useState, useMemo } from 'react';
import { Box, Typography, Card, Button } from '@mui/material';
import Icon from '../Icons/Icon.jsx';
import iconList from './iconList';
import IconColorPicker from './IconColorPicker.jsx';
import { useTools } from 'hooks/useTool.tsx';

const IconSelector = ({ tool, setModalContent, id }) => {
  const { edit, updateTool } = useTools(tool, id);
  const [selectedIcon, setSelectedIcon] = useState(edit.icon);
  const [iconColor, setIconColor] = useState(edit.icon.color);
  const [bg, setBg] = useState(edit.icon.backgroundColor || '#fbf7ef');

  const handleIconChange = (event, newValue) => {
    setSelectedIcon(newValue);
  };

  const handleBackgroundChange = (newBg) => {
    setBg(newBg);
  };

  const handleColorChange = (color) => {
    setIconColor(color);
  };

  const onConfirm = () => {
    const completeIcon = {
      ...selectedIcon,
      color: iconColor,
      backgroundColor: bg,
    };
    updateTool('icon', completeIcon);
    setModalContent(null);
  };

  const sortedList = useMemo(
    () => [...iconList].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

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
            color={iconColor}
            backgroundColor={bg}
          />
        </Box>
        <IconColorPicker
          sourceColor={iconColor}
          onChange={handleColorChange}
          onBackgroundChange={handleBackgroundChange}
        />
      </Box>
      {sortedList.map(
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
                  position: 'relative',
                }}
              >
                <Icon
                  viewBox={icon.viewBox}
                  path={icon.d}
                  size={48}
                  color={iconColor}
                />
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    display: {
                      xs: 'none',
                      md: 'block',
                    },
                  }}
                >
                  {icon.name}
                </Typography>
              </Button>
            </Card>
          )
      )}
      <Box
        sx={{
          gridColumn: 'span 6',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="outlined"
          sx={{ width: '50%', mt: 2 }}
          onClick={() => setModalContent(null)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ width: '50%', mt: 2 }}
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default IconSelector;
