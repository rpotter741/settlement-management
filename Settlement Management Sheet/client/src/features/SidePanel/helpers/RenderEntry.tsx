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
import { ToolName } from '@/app/types/ToolTypes.js';
import { AnimatePresence } from 'framer-motion';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';

const maxTrail = 3;

interface RenderEntryProps {
  entry: {
    title: string;
    icon?: React.ElementType;
    children?: Array<{
      title: string;
      icon?: React.ElementType;
      onClick?: () => void;
    }>;
    tool?: string;
  };
  index: number;
  active: string | null;
  setActive: (title: string | null) => void;
  clickFn?: () => {
    name: string;
    id: string;
    mode?: string;
    tool?: string;
    tabId?: string;
    scroll?: boolean;
    preventSplit?: boolean;
  };
  setTool?: (tool: string) => void;
}

const RenderEntry: React.FC<RenderEntryProps> = ({
  entry,
  index,
  active,
  setActive,
  clickFn,
  setTool,
}) => {
  const { addNewTab, setActiveTab } = useSidePanel();

  if (entry.title === active) {
    console.log(active, entry.children);
  }

  const handleClick = (title: string) => {
    if (clickFn === undefined) {
      const trail = getTrail(structure, title);
      // updateBreadcrumbs(trail.slice(0, maxTrail));
      if (active === title) {
        setActive(null);
      } else {
        setActive(title);
      }
      if (setTool) {
        setTool((entry.tool as string) || '');
      }
    } else {
      const { name, id, mode, tool, tabId, scroll, preventSplit } = clickFn();

      addNewTab({
        name,
        id,
        mode: 'preview',
        tool: tool as ToolName,
        tabId,
        scroll: 0,
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
      <AnimatePresence mode="popLayout">
        <MotionBox
          initial={{ height: 0, opacity: 0 }}
          animate={
            active === entry.title
              ? { height: 'auto', opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
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
              //@ts-ignore
              clickFn={child.onClick}
            />
          ))}
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export default RenderEntry;
