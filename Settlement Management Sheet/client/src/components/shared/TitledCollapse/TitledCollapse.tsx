import React, { useEffect, useState } from 'react';
import {
  Box,
  Collapse,
  Typography,
  IconButton,
  Divider,
  Button,
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
  ...props
}) => {
  return (
    <Box sx={{ width: '100%', borderRadius: 4, ...boxSx }}>
      {/* Title Bar */}
      <Box
        onClick={toggleOpen}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          py: 1,
          backgroundColor: open ? 'background.default' : 'background.paper',
          '&:hover': { backgroundColor: 'action.hover' },
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
            ...props.titleSx,
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={toggleOpen}
          size="small"
          sx={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            ...props.iconButtonSx,
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Divider sx={{ gridColumn: 'span 3' }} />
      {/* Collapsible Content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {onRemove && (
          <Button onClick={onRemove} startIcon={<TrashIcon />}>
            Delete
          </Button>
        )}
        <Box sx={{ height: '100%' }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default TitledCollapse;
