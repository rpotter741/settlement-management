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
  ...props
}) => {
  return (
    <Box sx={{ width: '100%', borderRadius: 4, ...boxSx }}>
      {/* Title Bar */}
      <Box
        onClick={noDefaultHandler}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          py: 1,
          backgroundColor: defaultState
            ? 'background.default'
            : 'background.paper',
          '&:hover': { backgroundColor: 'action.hover' },
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
            color: color || 'inherit',
            ...props.titleSx,
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={noDefaultHandler}
          size="small"
          sx={{
            transform: defaultState ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Divider sx={{ gridColumn: 'span 3' }} />
      {/* Collapsible Content */}
      <Collapse in={defaultState} timeout="auto" unmountOnExit>
        {onRemove && (
          <Button onClick={onRemove} startIcon={<TrashIcon />}>
            Delete
          </Button>
        )}
        <Box sx={{ height: '100%' }}>{children}</Box>
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
