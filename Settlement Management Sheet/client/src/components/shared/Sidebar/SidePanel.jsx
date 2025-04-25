import React, { useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Toolbar,
  List,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider,
  Collapse,
  IconButton,
} from '@mui/material';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import ConstructionIcon from '@mui/icons-material/Construction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import LoadTool from 'components/shared/LoadTool/SidePanelLoad.jsx';
import { useTheme } from 'context/ThemeContext.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import getTrail from './getTrail.js';
import structure from './structure.js';

const maxTrail = 3;

const SidePanel = () => {
  const { breadcrumbs, updateBreadcrumbs, setActiveTab } = useSidePanel();
  const [active, setActive] = useState('');
  const [tool, setTool] = useState(null);
  const { themeKey, changeThemeTo } = useTheme();
  const [minimized, setMinimized] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'start',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: 'divider',
          width: 48,
          maxWidth: 48,
          borderRight: 1,
          borderColor: 'primary.light',
          boxSizing: 'border-box',
          py: 1,
        }}
      >
        <Tooltip
          title={minimized ? 'Expand' : 'Collapse'}
          arrow
          placement="right"
        >
          <IconButton
            onClick={() => setMinimized(!minimized)}
            sx={{ border: 0, borderRadius: 0, height: 36, maxHeight: 36 }}
          >
            {!minimized ? <MoreVertIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
        <Box sx={{ height: 36 }}></Box>
        <Tooltip title="Creation Tools" arrow placement="right">
          <IconButton sx={{ border: 0, borderRadius: 0, height: 36 }}>
            <ConstructionIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Glossary" arrow placement="right">
          <IconButton sx={{ border: 0, borderRadius: 0, height: 36 }}>
            <MenuBookIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settlement Dashboard" arrow placement="right">
          <IconButton sx={{ border: 0, borderRadius: 0, height: 36 }}>
            <DashboardIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Collapse in={!minimized} orientation="horizontal">
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            flexDirection: 'column',
            display: 'flex',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            p: 1,
          }}
        >
          <Typography variant="h5" sx={{ height: 36, maxHeight: 36 }}>
            Eclorean Ledger
          </Typography>

          {/* {breadcrumbs.map((entry, index) => {
        return <Typography>{entry}</Typography>;
        })} */}
          <List sx={{ p: 0 }}>
            {structure.map((entry, index) =>
              entry.type === 'header' ? (
                <RenderHeader
                  entry={entry}
                  index={index}
                  key={index}
                  setActive={setActive}
                  active={active}
                  setTool={setTool}
                />
              ) : entry.type === 'link' ? (
                <RenderEntry
                  entry={entry}
                  index={index}
                  key={index}
                  active={active === entry.title}
                  setActive={setActive}
                  setTool={setTool}
                />
              ) : null
            )}
          </List>
          <Divider
            flexItem
            sx={{
              borderColor: 'secondary.main',
              px: 2,
            }}
          >
            <Chip
              label="Search"
              sx={{
                backgroundColor: 'transparent',
                fontSize: '1rem',
                color: 'secondary.main',
              }}
            />
          </Divider>
          {active && <LoadTool tool={tool} displayName={active} />}
        </Box>
      </Collapse>
    </Box>
  );
};

const RenderHeader = ({ entry, index, setActive, active, setTool }) => {
  return (
    <Box key={entry.title} sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          minHeight: 36,
          maxHeight: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Divider
          flexItem
          sx={{
            color: 'secondary.main',
            borderColor: 'secondary.main',
            width: '100%',
            px: 2,
          }}
        >
          <Chip
            label={entry.title}
            sx={{
              backgroundColor: 'transparent',
              fontSize: '1rem',
              color: 'secondary.main',
            }}
          />
        </Divider>
      </Box>
      {entry.children.map((child, childIndex) => (
        <RenderEntry
          key={child.title}
          entry={child}
          index={childIndex}
          active={active}
          setActive={setActive}
          setTool={setTool}
        />
      ))}
    </Box>
  );
};

const RenderEntry = ({ entry, index, active, setActive, clickFn, setTool }) => {
  const { tabs, addNewTab, updateBreadcrumbs, setActiveTab } = useSidePanel();

  const handleClick = (title) => {
    if (clickFn === undefined) {
      const trail = getTrail(structure, title);
      updateBreadcrumbs(trail.slice(0, maxTrail));
      if (active === title) {
        setActive(null);
      } else {
        setActive(title);
      }
      setTool(entry.tool);
    } else {
      const { name, id, mode, type, tabId, scroll } = clickFn();
      addNewTab({ name, id, mode, type, tabId, scroll, activate: true });
    }
  };

  return (
    <Box
      key={entry.title}
      sx={{
        backgroundColor: active === entry.title ? 'info.light' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <ListItemButton
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: 36,
          maxHeight: 36,
          width: '100%',
          '&:hover': { color: 'white' },
        }}
        onClick={() => {
          handleClick(entry.title);
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            width: '100%',
          }}
        >
          <ListItemIcon>
            {entry.icon && <entry.icon sx={{ color: 'secondary.light' }} />}
          </ListItemIcon>
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{
              '&hover': { color: 'white' },
              color: active === entry.title ? 'black' : 'text.primary',
            }}
          >
            {entry.title}
          </Typography>
        </Box>
      </ListItemButton>
      {active === entry.title && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            width: '100%',
            height: 36,
            maxHeight: 36,
          }}
        >
          {entry.children.map((child, childIndex) => (
            <RenderEntry
              key={child.title}
              entry={child}
              index={childIndex}
              active={active}
              setActive={setActive}
              clickFn={child.onClick}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SidePanel;
