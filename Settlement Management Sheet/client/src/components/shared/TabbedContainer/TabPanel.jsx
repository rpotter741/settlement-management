import React from 'react';
import { Box } from '@mui/material';

const TabPanel = React.memo(({ children, value, id, tool }) => {
  if (value !== id) return null;
  return (
    <Box
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      sx={{
        height: '100%',
        width: '100%',
        flexGrow: 1,
        py: tool !== 'event' ? 2 : 0,
      }}
    >
      {children}
    </Box>
  );
});

export default TabPanel;
