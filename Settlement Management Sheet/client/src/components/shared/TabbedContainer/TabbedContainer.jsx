import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import {
  Box,
  Tab,
  IconButton,
  Divider,
  Avatar,
  Typography,
} from '@mui/material';
import SidePanel from '../Sidebar/SidePanel.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';
import { useTheme } from 'context/ThemeContext.jsx';

import CloseIcon from '@mui/icons-material/Close';
import ExtensionIcon from '@mui/icons-material/Extension';
import CategoryIcon from '@mui/icons-material/Category';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import CreateAttribute from 'features/Attributes/components/wrappers/CreateAttribute.jsx';
import CreateCategory from 'features/Categories/components/wrappers/CreateCategory.jsx';

const componentMap = {
  attribute: CreateAttribute,
  category: CreateCategory,
};

const iconMap = {
  attribute: <ExtensionIcon />,
  category: <CategoryIcon />,
};

const TabPanel = ({ children, value, index, id }) => (
  <Box
    role="tabpanel"
    hidden={value !== id}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    style={{ height: '100%', width: '100%' }}
  >
    {value === id && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          flexGrow: 1,
          flexDirection: 'row',
          height: '100%',
          width: '100%',
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
  onAdd,
  layout = 'row', // "row" for side-by-side, "column" for stacked
  headerSx,
  tabSx,
}) => {
  const { tabs, removeById, setActiveTab, currentTab } = useSidePanel();
  const [open, setOpen] = useState(false);
  const { themeKey, changeThemeTo } = useTheme();

  useEffect(() => {
    console.log(currentTab, 'currentTab');
  }, [currentTab]);

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
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          p: 2,
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          height: 48,
          borderBottom: 1,
          borderColor: 'primary.light',
          gap: 2,
        }}
      >
        <IconButton
          onClick={() => {
            changeThemeTo(themeKey === 'dark' ? 'default' : 'dark');
          }}
          sx={{ color: themeKey === 'dark' ? 'honey.main' : 'dividerDark' }}
        >
          {themeKey === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <Avatar
          size="small"
          alt="RobbiePottsDM"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Typography variant="h6" noWrap component="div">
          robbiepottsdm
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
        className="tabbed-container"
      >
        {/* side panel */}
        <Box sx={{ height: '100vh', borderRight: 1, p: 0, m: 0 }}>
          <SidePanel />
        </Box>
        {/* Tabs Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflowY: 'hidden',
            overflowX: 'hidden',
            backgroundColor: 'background.default',
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              width: '100%',
              ...headerSx,
              boxSizing: 'border-box',
              backgroundColor: 'background.paper',
            }}
            className="tab-header"
          >
            {Array.isArray(tabs) &&
              tabs.map((tab, index) => (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid',
                    borderColor:
                      currentTab === tab.tabId ? 'primary.main' : 'dividerDark',
                    backgroundColor:
                      currentTab === tab.tabId ? 'primary.main' : 'divider',
                  }}
                  onClick={() => {
                    setActiveTab(index, tab.tabId);
                  }}
                  key={tab.tabId}
                >
                  <Tab
                    label={tab.name}
                    value={tab.tabId}
                    {...a11yProps(index)}
                    iconPosition="start"
                    icon={iconMap[tab.type]}
                    sx={{ my: -2 }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeById(tab.tabId);
                    }}
                  >
                    <CloseIcon fontSize="0.75rem" />
                  </IconButton>
                </Box>
              ))}
            {onAdd && <Tab label="+" value="add-tab" />}
          </Box>

          {/* Tabs Content */}
          {Array.isArray(tabs) ? (
            tabs.map((tab, index) => (
              <TabPanel
                key={index}
                value={currentTab}
                index={index}
                id={tab.tabId}
              >
                <Box
                  sx={
                    tab.contentSx
                      ? tab.contentSx
                      : {
                          display: 'flex',
                          flexDirection: ['column', 'row'],
                          overflowY: 'hidden',
                          overflowX: 'hidden',
                          height: '100%',
                          width: '100%',
                          flexGrow: 2,
                          flexShrink: 1,
                          gap: 2,
                          justifyContent: 'center',
                          backgroundColor: 'background.default',
                          pt: 2,
                        }
                  }
                  role="tabbox"
                >
                  {componentMap[tab.type] ? (
                    React.createElement(
                      componentMap[tab.type],
                      { id: tab.id, mode: tab.mode },
                      toggleDrawer
                    )
                  ) : (
                    <Box>Error: Component not found</Box>
                  )}
                </Box>
              </TabPanel>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                flexGrow: 1,
              }}
            >
              <Box sx={{ borderRadius: 4, boxShadow: 4, px: 8, py: 4 }}>
                No tabs open!
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TabbedContainer;
