import React from 'react';
import { Box } from '@mui/material';

const TabPanel = React.memo(({ children, value, id }) => {
  if (value !== id) return null;
  return (
    <Box
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      sx={{ height: '100%', width: '100%', flexGrow: 1, py: 2 }}
    >
      {children}
    </Box>
  );
});

export default TabPanel;
