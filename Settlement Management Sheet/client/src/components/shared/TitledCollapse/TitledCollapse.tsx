import React, { useEffect, useState } from 'react';
import {
  Box,
  Collapse,
  Typography,
  IconButton,
  Divider,
  Button,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

interface TitledCollapseProps {
  title: string;
  titleType?: 'h6' | 'h5' | 'h4';
  toggleOpen: () => void;
  children: React.ReactNode;
  open: boolean;
  onRemove?: () => void;
  width?: string | number;
  color?: string;
  styles?: React.CSSProperties;
  boxSx?: Record<string, any>;
  titleSx?: Record<string, any>;
  childContainerSx?: Record<string, any>;
  iconButtonSx?: Record<string, any>;
  [key: string]: any; // Allow additional props
}

const TitledCollapse: React.FC<TitledCollapseProps> = ({
  title,
  titleType = 'h6',
  toggleOpen,
  children,
  open = false,
  onRemove,
  width,
  color,
  styles,
  boxSx,
  titleSx,
  childContainerSx,
  iconButtonSx,
  ...props
}) => {
  return (
    <Box sx={{ width: '100%', borderRadius: 4, ...boxSx, overflowY: 'hidden' }}>
      {/* Title Bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 11,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 1,
          backgroundColor: 'inherit',
          mt: 2,
          gridColumn: 'span 3',
          ...styles,
        }}
      >
        {props?.icon && React.createElement(props.icon, { ...props.iconProps })}
        {/* Title */}
        <Typography
          variant={titleType}
          sx={{
            fontWeight: 'bold',
            color: color || 'inherit',
            ...titleSx,
          }}
        >
          {title}
        </Typography>
        <Tooltip title={open ? 'Collapse' : 'Expand'}>
          <IconButton
            onClick={toggleOpen}
            size="small"
            sx={{
              transform: open ? 'rotate(360deg)' : 'rotate(270deg)',
              transition: 'transform 0.3s ease',
              ...iconButtonSx,
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ gridColumn: 'span 3' }} />
      {/* Collapsible Content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {onRemove && (
          <Button onClick={onRemove} startIcon={<TrashIcon />}>
            Delete
          </Button>
        )}
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            ...childContainerSx,
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default TitledCollapse;
