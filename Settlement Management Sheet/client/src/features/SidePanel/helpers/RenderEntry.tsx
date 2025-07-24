import React from 'react';
import {
  Box,
  Collapse,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { useSidePanel } from '@/hooks/global/useSidePanel.js';
import getTrail from '@/features/SidePanel/getTrail.js';
import { v4 as newId } from 'uuid';
import structure from '../structure.js';

const maxTrail = 3;

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
      const { name, id, mode, tool, tabId, scroll, preventSplit } = clickFn();

      addNewTab({
        name,
        id,
        mode,
        tool,
        tabId,
        scroll,
        activate: true,
        preventSplit,
        side: 'left',
      });
    }
  };

  return (
    <Box
      key={entry.title}
      sx={{
        backgroundColor:
          active === entry.title ? 'accent.light' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
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
            {entry.icon && (
              <entry.icon
                sx={{
                  color:
                    active === entry.title ? 'success.main' : 'secondary.light',
                }}
              />
            )}
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
      <Collapse in={active === entry.title}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            width: '100%',
          }}
        >
          {(entry?.children || []).map((child, childIndex) => (
            <RenderEntry
              key={newId()}
              entry={child}
              index={childIndex}
              active={active}
              setActive={setActive}
              clickFn={child.onClick}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default RenderEntry;
