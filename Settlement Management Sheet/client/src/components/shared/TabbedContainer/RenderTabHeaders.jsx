import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import DragWrapper from '../DnD/DragWrapper.jsx';

import { toolMap } from 'utility/toolMap.js';

const RenderTabHeaders = ({
  tabs,
  currentTab,
  setActiveTab,
  removeById,
  side = 'left',
}) => {
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
              <Tab
                label={tab.name}
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
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeById(tab.tabId, side, false);
                }}
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
