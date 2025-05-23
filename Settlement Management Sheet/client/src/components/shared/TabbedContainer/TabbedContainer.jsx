import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  Suspense,
} from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Modal } from '@mui/material';

import SidePanel from 'features/SidePanel/SidePanel.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';
import { useDragContext } from 'context/DragContext.jsx';
import { useSnackbar } from 'context/SnackbarContext.jsx';

import DropZone from '../DnD/DropZone.jsx';

import RenderTabHeaders from './RenderTabHeaders.jsx';
import RenderTabs from './RenderTabs.jsx';
import { sidePanelSelectors as select } from 'features/SidePanel/sidePanelSelectors.js';

import {
  LeftTabsProvider,
  RightTabsProvider,
} from 'context/TabsContext/TabsContext.jsx';

const TabbedContainer = () => {
  const {
    leftTabs,
    rightTabs,
    currentLeftTab,
    currentRightTab,
    addNewTab,
    removeById,
    setActiveTab,
    isSplit,
    setSplit,
    moveLeft,
    moveRight,
    preventSplit,
    setPreventSplit,
  } = useSidePanel();
  const { draggedType } = useDragContext();
  const { showSnackbar } = useSnackbar();
  const [modalContent, setModalContent] = useState(null);

  const noSplit = useMemo(
    () => leftTabs.some((tab) => tab.tool === 'event'),
    [leftTabs]
  );

  useEffect(() => {
    if (noSplit && preventSplit === false) {
      setPreventSplit(true);
    }
  }, [noSplit, preventSplit, setPreventSplit]);

  const moveRTL = useCallback(
    (entry) => {
      if (rightTabs.some((tab) => tab.tabId === entry.tabId)) {
        moveLeft(entry.tabId);
      } else {
        addNewTab({ ...entry, side: 'left' });
      }
    },
    [rightTabs, moveLeft, addNewTab]
  );

  const moveLTR = useCallback(
    (entry) => {
      if (preventSplit) {
        showSnackbar(
          'Split view is disabled for Events, APTs, and Story Threads.',
          'error',
          5000
        );
        return;
      }
      if (leftTabs.some((tab) => tab.tabId === entry.tabId)) {
        moveRight(entry.tabId);
      } else {
        addNewTab({ ...entry, side: 'right' });
      }
    },
    [leftTabs, moveRight, addNewTab, preventSplit, showSnackbar]
  );

  useEffect(() => {
    if (rightTabs.length > 0 && leftTabs.length === 0) {
      moveLeft(rightTabs[0].tabId);
    }
  }, [rightTabs, leftTabs]);

  useEffect(() => {
    if (rightTabs.length > 0) {
      if (isSplit === false) {
        setSplit(true);
      }
    }
  }, [isSplit, rightTabs, setSplit]);

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
        <SidePanel setModalContent={setModalContent} />
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
            />
            {rightTabs.length > 0 && (
              <RenderTabHeaders
                isSplit={isSplit}
                tabs={rightTabs}
                currentTab={currentRightTab}
                setActiveTab={setActiveTab}
                removeById={removeById}
                side="right"
              />
            )}
          </Box>
          {modalContent && (
            <Modal open={true} onClose={() => setModalContent(null)}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 'calc(50% + 150px)',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.default',
                  border: '2px solid #000',
                  borderColor: 'secondary.light',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 4,
                  ml: 1,
                }}
              >
                <Suspense fallback={<Box>Loading...</Box>}>
                  {React.createElement(modalContent?.component, {
                    ...modalContent?.props,
                    setModalContent,
                  })}
                </Suspense>
              </Box>
            </Modal>
          )}
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
            <LeftTabsProvider>
              <RenderTabs side="left" setModalContent={setModalContent} />
            </LeftTabsProvider>
            {useSelector(select.isSplit) && (
              <>
                <Divider flexItem orientation="vertical" />
                <RightTabsProvider>
                  <RenderTabs side="right" setModalContent={setModalContent} />
                </RightTabsProvider>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TabbedContainer;
