import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TabPanel = ({ children, value, id }) => (
  <Box
    role="tabpanel"
    hidden={value !== id}
    id={`tabpanel-${id}`}
    aria-labelledby={`tab-${id}`}
    style={{ height: '100%', width: '100%' }}
  >
    {value === id && (
      <Box
        key={id}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          flexGrow: 1,
          flexDirection: 'row',
          height: '100%',
          width: '100%',
          border: '1px solid',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    )}
  </Box>
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
  const [activeTab, setActiveTab] = useState(null);

  const handleChange = (event, newValue) => {
    if (newValue === 'add-tab') {
      onAdd();
    } else {
      setActiveTab(newValue);
    }
  };

  const handleRemove = (id) => {
    onRemove(id);
    if (activeTab === id) {
      setActiveTab(null); // Adjust active tab focus if needed
    }
  };

  useEffect(() => {
    if (activeTab === null && tabs.length > 0) {
      setActiveTab(tabs[0].tabId); // Set the first tab as active if none is selected
    }
  }, [tabs]);

  return (
    <Box
      sx={{
        width: '100%', // Match the parent's width
        height: '100%', // Match the parent's height
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'start',
        flexShrink: 1,
        maxWidth: [600, 800, 1200, 1600],
        overflowX: 'show',
      }}
    >
      {/* Tabs Header */}
      <Box
        sx={{
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          maxHeight: 40,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {tabs.map((tab, index) => (
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid',
                boxSizing: 'border-box',
                maxHeight: 48,
                overflow: 'hidden',
                borderRadius: '16px 16px 0 0',
                p: 0.5,
                backgroundColor:
                  activeTab === tab.tabId ? 'primary.main' : 'background.paper',
                color: activeTab === tab.tabId ? 'white' : 'text.primary',
                borderColor:
                  activeTab === tab.tabId ? 'primary.main' : 'dividerDark',
              }}
              onClick={() => {
                setActiveTab(tab.tabId);
              }}
              key={tab.tabId}
            >
              <Tab
                label={tab.name}
                value={tab.tabId}
                sx={{
                  my: -2,
                  p: 2,
                  fontSize: '0.875rem',
                  maxHeight: 44,
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(tab.tabId);
                }}
              >
                <CloseIcon fontSize="0.75rem" sx={{ color: 'warning.main' }} />
              </IconButton>
            </Box>
          ))}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              boxSizing: 'border-box',
              maxHeight: 48,
              overflow: 'hidden',
              borderRadius: '16px 16px 0 0',
              p: 0.5,
              height: 38,
              borderColor: 'dividerDark',
              backgroundColor: 'secondary.main',
            }}
          >
            <Tab
              label={'Add Phase'}
              value={null}
              sx={{
                my: -2,
                p: 2,
                fontSize: '0.875rem',
                maxHeight: 44,
                textDecoration: 'underline',
                color: 'white',
                fontWeight: 'bold',
              }}
              onClick={onAdd}
            />
          </Box>
        </Box>
      </Box>

      {/* Tabs Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} id={tab.tabId}>
          {React.createElement(tab.component, tab.props || {})}
        </TabPanel>
      ))}
    </Box>
  );
};

export default InnerTabbedContainer;
