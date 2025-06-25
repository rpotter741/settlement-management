import React, { useEffect } from 'react';
import {
  Box,
  Tab,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Circle, Close as CloseIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import DragWrapper from '../DnD/DragWrapper.jsx';

import { tabMap } from '@/maps/tabMap.js';

import truncateWithEllipsis from 'utility/truncateWithEllipses.js';
import { useTabDrag } from 'context/DnD/TabDragContext.jsx';
import { AppDispatch, RootState } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import {
  useLeftTabs,
  useRightTabs,
} from '@/context/TabsContext/TabsContext.js';
import { focusedTab } from '@/app/selectors/sidePanelSelectors.js';
import { useModalActions } from '@/hooks/useModal.js';
import { setActiveTab as focusTab } from '@/app/slice/sidePanelSlice.js';

interface RenderTabHeadersProps {
  setActiveTab: (index: number, tabId: string, side: 'left' | 'right') => void;
  removeById: (
    tabId: string,
    side: 'left' | 'right',
    preventSplit: boolean
  ) => void;
  side?: 'left' | 'right';
  setDragSide?: (side: 'left' | 'right' | null) => void;
}

const RenderTabHeaders: React.FC<RenderTabHeadersProps> = ({
  setActiveTab,
  removeById,
  side = 'left',
  setDragSide = (side: 'left' | 'right' | null) => {},
}) => {
  const { tabs, current } = side === 'left' ? useLeftTabs() : useRightTabs();
  const { startDrag, endDrag, draggedType } = useTabDrag();
  const dispatch: AppDispatch = useDispatch();
  const { showModal } = useModalActions();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  useEffect(() => {
    if (draggedType === 'leftTab') {
      return setDragSide('right');
    }
    if (draggedType === 'rightTab') {
      return setDragSide('left');
    }
    setDragSide(null);
  }, [draggedType, setDragSide]);

  const activeTab = useSelector(focusedTab);

  if (Array.isArray(tabs)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'row',
          justifyContent: 'start',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          borderBottom: '2px solid',
          borderColor: 'divider',
        }}
      >
        {tabs.map((tab, index) => {
          return (
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
                  borderBottom: '4px solid',
                  color:
                    current === tab.tabId
                      ? 'primary.contrastText'
                      : 'text.primary',
                  borderColor:
                    activeTab?.tabId === tab.tabId
                      ? isDarkMode
                        ? 'honey.main'
                        : 'honey.main'
                      : current === tab.tabId
                        ? side === 'right'
                          ? 'secondary.main'
                          : 'primary.main'
                        : 'transparent',
                  backgroundColor:
                    current === tab.tabId
                      ? side === 'right'
                        ? 'secondary.main'
                        : 'primary.main'
                      : 'divider',
                  boxSizing: 'border-box',
                  maxHeight: 40,
                  overflow: 'hidden',
                }}
                onClick={() => {
                  setActiveTab(index, tab.tabId, side);
                  dispatch(focusTab({ tab }));
                }}
                key={tab.tabId}
              >
                <Tooltip
                  title={
                    <Typography>
                      {tab.name}{' '}
                      {tab.tool && tabMap[tab.tabType][tab.tool]?.headerName
                        ? `(${tabMap[tab.tabType][tab.tool]?.headerName})`
                        : ''}
                    </Typography>
                  }
                  placement="top"
                  arrow
                  enterDelay={500}
                >
                  <Tab
                    label={truncateWithEllipsis(tab.name, 20)}
                    value={tab.tabId}
                    iconPosition="start"
                    icon={
                      tabMap[tab.tabType][tab.tool].icon
                        ? React.createElement(
                            tabMap[tab.tabType][tab.tool]
                              .icon as unknown as React.ElementType,
                            {}
                          )
                        : undefined
                    }
                    sx={{
                      my: -2,
                      p: 2,
                      fontSize: '0.875rem',
                      maxHeight: 44,
                    }}
                  />
                </Tooltip>
                {tab?.isDirty && (
                  <Circle
                    sx={{
                      color:
                        current === tab.tabId ? 'warning.main' : 'error.main',
                      fontSize: '0.75rem',
                    }}
                  />
                )}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tab.isDirty) {
                      const entry = {
                        componentKey: 'ConfirmDirtyClose',
                        props: {
                          tab,
                        },
                        id: `confirm-dirty-close-${tab.tabId}`,
                      };
                      showModal({ entry });
                    } else {
                      removeById(tab.tabId, side, false);
                    }
                  }}
                  sx={{
                    zIndex: 4,
                    color:
                      current === tab.tabId ? 'warning.main' : 'error.main',
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </DragWrapper>
          );
        })}
      </Box>
    );
  }
};

export default RenderTabHeaders;
