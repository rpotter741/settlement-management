import React, { useState } from 'react';
import { Box, Button, Tab, Tabs } from '@mui/material';

import Sidebar from '../Sidebar/Sidebar';

const TabPanel = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
  >
    {value === index && (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {children}
      </Box>
    )}
  </div>
);

const a11yProps = (index) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

const TabbedContainer = ({
  tabs,
  onAdd,
  onRemove,
  removeLimit = 1,
  maxContentHeight = '87vh',
  height,
  maxWidth,
  headerSx,
  sidebar = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    if (newValue === 'add-tab') {
      onAdd();
    } else {
      setActiveTab(newValue);
    }
  };

  const handleRemove = (index) => {
    onRemove(index);
    if (activeTab >= tabs.length - 1) {
      setActiveTab(Math.max(0, tabs.length - 2)); // Adjust active tab focus if needed
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        p: 2,
      }}
    >
      {/* Tabs Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: 'auto',
          ...headerSx,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="dynamic tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.name}
              value={index}
              {...a11yProps(index)}
              sx={{ mx: 2 }}
            />
          ))}
          {onAdd && <Tab label="+" value="add-tab" />} {/* Add Button */}
        </Tabs>
      </Box>

      {/* Tabs Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          <Box
            sx={{
              overflowY: 'hidden',
              justifyContent: 'space-around',
              width: '100%',
              boxShadow: 4,
              p: 2,
              borderRadius: 4,
              flexGrow: 1,
              backgroundColor: 'text.secondary',
            }}
          >
            {/* Sidebar */}
            {sidebar && (
              <Box
                sx={{
                  width: '30%',
                  minWidth: ['15rem', '20rem', '30rem'],
                  maxWidth: ['20rem', '30rem', '40rem'],
                  height: '100%',
                  overflowY: 'scroll',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'start',
                  gap: 1,
                  mx: 1,
                  mr: 2,
                  px: 1,
                  boxShadow: 3,
                  backgroundColor: 'background.default',
                  borderColor: 'secondary.dark',
                  borderRadius: 4,
                }}
              >
                <Sidebar />
              </Box>
            )}
            {/* Render Component */}
            {React.isValidElement(tab.component) ? (
              React.cloneElement(tab.component, tab.props)
            ) : (
              <tab.component {...tab.props} />
            )}

            {/* Remove Button */}
            {tabs.length > removeLimit && (
              <Button
                onClick={() => handleRemove(index)}
                variant="contained"
                color="error"
                size="small"
              >
                ✕
              </Button>
            )}
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabbedContainer;
