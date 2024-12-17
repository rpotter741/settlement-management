import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';

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

const TabbedContainer = ({ tabs, onAdd, onRemove, removeLimit = 1 }) => {
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
      }}
    >
      {/* Tabs Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="dynamic tabs"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.name}
              value={index}
              {...a11yProps(index)}
            />
          ))}
          {onAdd && <Tab label="+" value="add-tab" />} {/* Add Button */}
        </Tabs>
      </Box>

      {/* Tabs Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
