import React from 'react';
import { Box } from '@mui/material';

interface PageBoxProps {
  children: React.ReactNode;
  outerStyle?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
}

const PageBox: React.FC<PageBoxProps> = ({
  children,
  outerStyle = {},
  innerStyle = {},
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
          ...innerStyle,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageBox;
