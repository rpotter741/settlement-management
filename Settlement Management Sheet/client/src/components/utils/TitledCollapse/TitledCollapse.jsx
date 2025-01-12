import React, { useEffect, useState } from 'react';
import {
  Box,
  Collapse,
  Typography,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrashIcon from '@mui/icons-material/Delete';

const CustomCollapse = ({
  title,
  titleType = 'h6',
  noDefaultHandler,
  children,
  defaultState = false,
  onRemove,
  width,
  color,
  styles,
  PreviewComponent,
  previewProps,
  boxSx,
}) => {
  return (
    <Box sx={{ width: '100%', borderRadius: 4, ...boxSx }}>
      {/* Title Bar */}
      <Box
        onClick={noDefaultHandler}
        sx={{
          borderRadius: 4,
          width: width || '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          cursor: 'pointer',
          backgroundColor: defaultState ? '#f0f0f0' : '#f5f5f5',
          '&:hover': { backgroundColor: '#f0f0f0' },
          mt: 2,
          gridColumn: 'span 3',
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
          {/* <IconButton
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
          </IconButton> */}
          <IconButton
            onClick={noDefaultHandler}
            size="small"
            sx={{
              position: 'absolute',
              right: '0.5rem',
              transform: defaultState ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ gridColumn: 'span 3' }} />
      {/* Collapsible Content */}
      <Collapse in={defaultState} timeout="auto" unmountOnExit>
        {onRemove && (
          <Button onClick={onRemove} startIcon={<TrashIcon />}>
            Delete
          </Button>
        )}
        <Box sx={{ padding: '12px 16px', height: '100%' }}>{children}</Box>
      </Collapse>
      {PreviewComponent && (
        <Collapse in={!defaultState} timeout="auto" unmountOnExit>
          <Box sx={{ padding: '12px 16px', height: '100%' }}>
            {React.isValidElement(PreviewComponent) ? (
              React.cloneElement(PreviewComponent, previewProps)
            ) : (
              <PreviewComponent {...previewProps} />
            )}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default CustomCollapse;
