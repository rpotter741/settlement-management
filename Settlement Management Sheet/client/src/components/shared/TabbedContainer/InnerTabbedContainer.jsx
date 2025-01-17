import React, { useState } from 'react';
import { Box, Button, Tab, Tabs, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          boxShadow: 4,
          borderRadius: '0 0 16px 16px',
          border: 1,
          borderTop: 0,
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

const InnerTabbedContainer = ({
  tabs,
  onAdd,
  onRemove,
  removeLimit = 1,
  maxContentHeight = '87vh',
  height,
  maxWidth,
  headerSx,
  addLabel = 'Add Phase',
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
        width: '100%', // Match the parent's width
        height: '100%', // Match the parent's height
        maxHeight: '67rem',
        overflowY: 'scroll',
        display: 'flex',
        borderRadius: 4,
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'start',
        flexShrink: 1,
      }}
    >
      {/* Tabs Header */}
      <Box
        sx={{
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
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {tab.name}
                  {onRemove && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
              value={index}
              {...a11yProps(index)}
              sx={{
                backgroundColor:
                  activeTab === index ? 'honey.light' : 'text.disabled',
                color:
                  activeTab === index ? 'background.paper' : 'primary.main',
                borderRadius: '16px 16px 0 0',
                borderWidth: 1,
                borderColor:
                  activeTab === index ? 'primary.main' : 'secondary.main',
                borderStyle: 'solid',
                borderBottom: 'none',
                boxSizing: 'border-box',
              }}
            />
          ))}
          {onAdd && (
            <Tab
              label={addLabel}
              value="add-tab"
              sx={{
                fontSize: '1rem',
                backgroundColor: 'background.paper',
                color: 'primary.main',
                borderWidth: 1,
                borderColor: 'secondary.main',
                borderStyle: 'solid',
                borderBottom: 'none',
                borderRadius: '16px 16px 0 0',
              }}
            />
          )}{' '}
          {/* Add Button */}
        </Tabs>
      </Box>

      {/* Tabs Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          {React.isValidElement(tab.component) ? (
            React.cloneElement(tab.component, tab.props)
          ) : (
            <tab.component {...tab.props} />
          )}
        </TabPanel>
      ))}
    </Box>
  );
};

export default InnerTabbedContainer;
