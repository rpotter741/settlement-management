import React, { useState } from 'react';
import { Box, Collapse, Typography, IconButton, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrashIcon from '@mui/icons-material/Delete';

const CustomCollapse = ({
  title,
  titleType = 'h6',
  children,
  onRemove,
  width,
  color,
  styles,
}) => {
  const [open, setOpen] = useState(false);

  const toggleCollapse = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ width: '100%', borderRadius: 4 }}>
      {/* Title Bar */}
      <Box
        onClick={toggleCollapse}
        sx={{
          borderRadius: 4,
          width: width || '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          cursor: 'pointer',
          backgroundColor: open ? '#f5f5f5' : '#f5f0e6',
          '&:hover': { backgroundColor: '#f0f0f0' },
          mt: 2,
          ...styles,
        }}
      >
        {/* Title */}
        <Typography
          variant={titleType}
          sx={{
            fontWeight: 'bold',
            width: '100%',
            color: color || 'inherit',
          }}
        >
          {title}
        </Typography>

        {/* Expand/Collapse Arrow */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}
        >
          <IconButton
            onClick={onRemove}
            size="small"
            sx={{
              display: onRemove ? 'block' : 'none',
              position: 'absolute',
              right: '2rem',
              color: 'secondary.light',
            }}
          >
            <TrashIcon />
          </IconButton>
          <IconButton
            onClick={toggleCollapse}
            size="small"
            sx={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon onClick={toggleCollapse} />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      {/* Collapsible Content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ padding: '12px 16px', height: '100%' }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default CustomCollapse;
