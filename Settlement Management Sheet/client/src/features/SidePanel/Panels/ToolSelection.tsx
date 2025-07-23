import React, { useState } from 'react';

import { List, Divider, Chip, Collapse, Box, Typography } from '@mui/material';
import structure from '../structure.js';
import LoadTool from 'components/shared/LoadTool/SidePanelLoad.jsx';
import RenderHeader from '../helpers/RenderHeader.js';
import RenderEntry from '../helpers/RenderEntry.js';
import { ToolName } from 'types/common.js';
import { useSidebarContext } from '@/context/SidePanel/SidePanelContext.js';

interface ToolSelectionProps {}

const ToolSelection: React.FC<ToolSelectionProps> = ({}) => {
  const { setContextKey, tool, setTool, active, setActive } =
    useSidebarContext();

  const handleToolClick = (tool: ToolName) => {
    setTool(tool);
  };

  return (
    <>
      <List sx={{ p: 0 }}>
        {structure.map((entry, index) =>
          entry.type === 'header' ? (
            <RenderHeader
              entry={entry}
              index={index}
              key={index}
              setActive={setActive}
              active={active}
              setTool={handleToolClick}
            />
          ) : entry.type === 'link' ? (
            <RenderEntry
              entry={entry}
              index={index}
              key={index}
              active={active === entry.title}
              setActive={setActive}
              setTool={handleToolClick}
              clickFn={() => {}}
            />
          ) : null
        )}
      </List>
    </>
  );
};

export default ToolSelection;
