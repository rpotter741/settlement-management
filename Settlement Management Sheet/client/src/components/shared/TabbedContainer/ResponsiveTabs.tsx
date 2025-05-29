import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const ResponsiveTabs = ({ tabs, value, onChange }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1, // Adjust spacing between tabs
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)', // 2 columns on extra small screens
          sm: 'repeat(3, 1fr)', // 3 columns on small screens
          md: `repeat(${tabs.length}, 1fr)`, // default tabs functionality on medium screens
        },
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable" // Allows horizontal scrolling if needed
        scrollButtons="auto"
        sx={{
          gridColumn: '1 / -1', // Make sure Tabs spans full grid width
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.name}
            value={index}
            sx={{
              minWidth: 0, // Remove default minWidth
              flex: '1 1 auto', // Allow tabs to flex and wrap
              textAlign: 'center',
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ResponsiveTabs;
