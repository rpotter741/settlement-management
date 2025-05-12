import React, { useEffect } from 'react';
import { Box, Tab } from '@mui/material';

import SidePanel from '../Sidebar/SidePanel.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';
import { useDragContext } from 'context/DragContext.jsx';

import DropZone from '../DnD/DropZone.jsx';

import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import ExtensionIcon from '@mui/icons-material/Extension';
import CategoryIcon from '@mui/icons-material/Category';
import KeyIcon from '@mui/icons-material/VpnKey';

import CreateAttribute from 'features/Attributes/components/wrappers/CreateAttribute.jsx';
import CreateCategory from 'features/Categories/components/wrappers/CreateCategory.jsx';
import CreateStatus from 'features/Statuses/components/wrappers/CreateStatus.jsx';
import CreateKey from 'features/Keys/components/wrappers/CreateKey.jsx';

import RenderTabHeaders from './RenderTabHeaders.jsx';

const componentMap = {
  attribute: CreateAttribute,
  category: CreateCategory,
  gameStatus: CreateStatus,
  key: CreateKey,
};

const iconMap = {
  attribute: <ExtensionIcon />,
  category: <CategoryIcon />,
  gameStatus: <CoronavirusIcon />,
  key: <KeyIcon />,
};

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
        }}
      >
        {children}
      </Box>
    )}
  </Box>
);

const a11yProps = (id) => ({
  id: `tab-${id}`,
  'aria-controls': `tabpanel-${id}`,
});

const TabbedContainer = ({
  onAdd,
  layout = 'row', // "row" for side-by-side, "column" for stacked
  headerSx,
  tabSx,
}) => {
  const {
    leftTabs,
    rightTabs,
    currentLeftTab,
    currentRightTab,
    addNewTab,
    removeById,
    setActiveTab,
    isSplit,
    moveLeft,
    moveRight,
  } = useSidePanel();
  const { draggedType } = useDragContext();

  useEffect(() => {
    if (rightTabs.length > 0 && leftTabs.length === 0) {
      moveLeft(rightTabs[0].tabId);
    }
  }, [rightTabs, leftTabs]);

  const moveRTL = (entry) => {
    const tab = rightTabs.find((tab) => tab.tabId === entry.tabId);
    if (tab) {
      moveLeft(entry.tabId);
    } else {
      addNewTab({ ...entry, side: 'left' });
    }
  };

  const moveLTR = (entry) => {
    const tab = leftTabs.find((tab) => tab.tabId === entry.tabId);
    console.log(entry, 'entry');
    if (tab) {
      moveRight(entry.tabId);
    } else {
      addNewTab({ ...entry, side: 'right' });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
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
          display: 'flex',
          height: '100%',
          width: '100%',
          overflowY: 'hidden',
          overflowX: 'hidden',
        }}
        className="tabbed-container"
      >
        {/* Side Panel */}
        <SidePanel />
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
            className="tab-header"
          >
            <RenderTabHeaders
              isSplit={isSplit}
              tabs={leftTabs}
              currentTab={currentLeftTab}
              setActiveTab={setActiveTab}
              removeById={removeById}
              iconMap={iconMap}
            />
            {rightTabs.length > 0 && (
              <RenderTabHeaders
                isSplit={isSplit}
                tabs={rightTabs}
                currentTab={currentRightTab}
                setActiveTab={setActiveTab}
                removeById={removeById}
                iconMap={iconMap}
                side="right"
              />
            )}
            {onAdd && <Tab label="+" value="add-tab" />}
          </Box>

          {/* Tabs Content */}
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              width: '100%',
              position: 'relative',
            }}
          >
            {(draggedType === 'rightTab' || draggedType === 'anyTab') && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  height: '100%',
                  opacity: 0.5,
                  zIndex: 11,
                }}
              >
                <DropZone
                  type={'rightTab' || 'anyTab'}
                  handleUpdate={() => {}}
                  handleAdd={(entry) => {
                    moveRTL(entry);
                  }}
                  handleRemove={() => {}}
                  onReorder={() => {}}
                  bg1="rgba(100, 100, 100, 0.5)"
                  bg2="rgba(255, 255, 255, 0.5)"
                  defaultItems={[]}
                />
              </Box>
            )}
            {(draggedType === 'leftTab' || draggedType === 'anyTab') && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '50%',
                  height: '100%',
                  opacity: 1,
                  zIndex: 1000,
                }}
              >
                <DropZone
                  type={draggedType}
                  handleUpdate={() => {}}
                  handleAdd={(entry) => {
                    moveLTR(entry);
                  }}
                  handleRemove={() => {}}
                  onReorder={() => {}}
                  bg1="rgba(100, 100, 100, 0.5)"
                  bg2="rgba(255, 255, 255, 0.5)"
                  defaultItems={[]}
                />
              </Box>
            )}

            {leftTabs.map((tab, index) => (
              <TabPanel
                key={index}
                value={currentLeftTab}
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
                          position: 'relative',
                        }
                  }
                  role="tab_box_left"
                >
                  {componentMap[tab.type] ? (
                    React.createElement(componentMap[tab.type], {
                      id: tab.id,
                      mode: tab.mode,
                      tabId: tab.tabId,
                      side: 'left',
                    })
                  ) : (
                    <Box>Error: Component not found</Box>
                  )}
                </Box>
              </TabPanel>
            ))}
            {rightTabs.map((tab, index) => (
              <TabPanel
                key={index}
                value={currentRightTab}
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
                          position: 'relative',
                          borderLeft: '1px solid',
                        }
                  }
                  role="tab_box_right"
                >
                  {componentMap[tab.type] ? (
                    React.createElement(componentMap[tab.type], {
                      id: tab.id,
                      mode: tab.mode,
                      tabId: tab.tabId,
                      side: 'right',
                    })
                  ) : (
                    <Box>Error: Component not found</Box>
                  )}
                </Box>
              </TabPanel>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TabbedContainer;
