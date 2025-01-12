import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { Box, Tabs, Tab, Drawer, IconButton, Tooltip } from '@mui/material';
import GlossaryIcon from '@mui/icons-material/Book';

const TabPanel = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    style={{ height: '100%', width: '100%' }}
  >
    {value === index && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          flexShrink: 1,
          flexDirection: 'row',
          height: '100%',
          gap: 2,
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

const TabbedContainer = ({
  tabs,
  onAdd,
  layout = 'row', // "row" for side-by-side, "column" for stacked
  headerSx,
  tabSx,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    tabs.map((tab) => {
      tab.props = { ...tab.props, toggleDrawer };
    });
  });

  const toggleDrawer = (bool) => {
    setOpen(bool);
  };

  const handleChange = (event, newValue) => {
    if (newValue === 'add-tab') {
      onAdd?.();
    } else {
      setActiveTab(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflowY: 'hidden',
        overflowX: 'hidden',
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
          width: '100%',
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
            />
          ))}
          {onAdd && <Tab label="+" value="add-tab" />} {/* Add Button */}
        </Tabs>
      </Box>

      {/* Tabs Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          <Tooltip title="Open Glossary">
            <IconButton
              sx={{
                position: 'absolute',
                left: 24,
                top: '12%',
                boxShadow: 2,
                zIndex: 1000,
              }}
            >
              <GlossaryIcon />
            </IconButton>
          </Tooltip>
          <Box sx={tab.contentSx ? tab.contentSx : {}}>
            {/* {tab.sidebarSx && <Sidebar sidebarSx={tab.sidebarSx} />} */}
            {tab.component ? (
              React.createElement(tab.component, tab.props, toggleDrawer)
            ) : (
              <Box>Error: Component not found</Box>
            )}
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabbedContainer;
