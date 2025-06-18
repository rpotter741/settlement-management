import React from 'react';
import { Box } from '@mui/material';
import { MuiStyledOptions, SxProps } from '@mui/system';

interface PageBoxProps {
  children: React.ReactNode;
  outerStyle?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  variant?: 'default' | 'fullWidth';
}

const variants: Record<'default' | 'fullWidth', React.CSSProperties> = {
  default: {},
  fullWidth: {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 0,
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: 'background.default',
    width: '100%',
    maxWidth: '100%',
    position: 'relative',
    flexShrink: 1,
    height: '100%',
    overflowY: 'scroll',
  },
};

const PageBox: React.FC<PageBoxProps> = ({
  children,
  outerStyle = {},
  innerStyle = {},
  variant = 'default',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        height: '100%',
        flexShrink: 0,
        flexGrow: 2,
        overflowY: 'scroll',
        overflowX: 'hidden',
        ...outerStyle,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          flexDirection: 'column',
          px: 4,
          mb: 9,
          boxShadow: 4,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          width: ['100%', '90%', '80%'],
          maxWidth: ['100%', '100%', 800],
          flexShrink: 1,
          height: '100%',
          overflowY: 'scroll',
          ...variants[variant as keyof typeof variants],
          ...innerStyle,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageBox;
