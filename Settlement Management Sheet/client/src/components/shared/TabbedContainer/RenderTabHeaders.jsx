import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import DragWrapper from '../DnD/DragWrapper.jsx';

import { toolMap } from 'utility/toolMap.js';

import truncateWithEllipsis from 'utility/truncateWithEllipses.js';
import { useTabDrag } from 'context/DnD/TabDragContext.jsx';

const RenderTabHeaders = ({
  tabs,
  currentTab,
  setActiveTab,
  removeById,
  side = 'left',
  setDragSide = () => {},
}) => {
  const { startDrag, endDrag, draggedType } = useTabDrag();
  useEffect(() => {
    if (draggedType === 'leftTab') {
      return setDragSide('right');
    }
    if (draggedType === 'rightTab') {
      return setDragSide('left');
    }
    setDragSide(null);
  }, [draggedType, setDragSide]);

  if (Array.isArray(tabs)) {
    return (
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
          <DragWrapper
            type={side === 'left' ? 'leftTab' : 'rightTab'}
            item={tab}
            key={tab.tabId}
            index={index}
            onDropEnd={(draggedItem) => {}}
            onReorder={(draggedIndex, targetIndex) => {}}
            startDrag={startDrag}
            endDrag={endDrag}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid',
                color:
                  currentTab === tab.tabId
                    ? 'primary.contrastText'
                    : 'text.primary',
                borderColor:
                  currentTab === tab.tabId
                    ? side === 'right'
                      ? 'secondary.main'
                      : 'primary.main'
                    : 'dividerDark',
                backgroundColor:
                  currentTab === tab.tabId
                    ? side === 'right'
                      ? 'secondary.main'
                      : 'primary.main'
                    : 'divider',
                boxSizing: 'border-box',
                maxHeight: 48,
                overflow: 'hidden',
              }}
              onClick={() => {
                setActiveTab('', tab.tabId, side);
              }}
              key={tab.tabId}
            >
              <Tooltip
                title={<Typography>{tab.name}</Typography>}
                placement="top"
                arrow
              >
                <Tab
                  label={truncateWithEllipsis(tab.name, 20)}
                  value={tab.tabId}
                  iconPosition="start"
                  icon={React.createElement(toolMap[tab.tool].icon, {})}
                  sx={{
                    my: -2,
                    p: 2,
                    fontSize: '0.875rem',
                    maxHeight: 44,
                  }}
                />
              </Tooltip>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeById(tab.tabId, side, false);
                }}
                sx={{ zIndex: 4 }}
              >
                <CloseIcon fontSize="0.75rem" />
              </IconButton>
            </Box>
          </DragWrapper>
        ))}
      </Box>
    );
  }
};

export default RenderTabHeaders;
