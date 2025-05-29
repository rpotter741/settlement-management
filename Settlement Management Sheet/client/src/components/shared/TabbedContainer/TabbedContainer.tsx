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
import { useSnackbar } from 'context/SnackbarContext.jsx';

import { TabDragProvider } from 'context/DnD/TabDragContext.tsx';
import TabDragBox from './TabDragBox.js';
import DropZone from 'components/shared/DnD/DropZone.jsx';

import RenderTabHeaders from './RenderTabHeaders.jsx';
import RenderTabs from './RenderTabs.jsx';
import { sidePanelSelectors as select } from 'features/SidePanel/sidePanelSelectors.js';

import {
  LeftTabsProvider,
  RightTabsProvider,
} from 'context/TabsContext/TabsContext.jsx';
import { TabData } from '@/app/types.js';

const TabbedContainer: React.FC = () => {
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
  const { showSnackbar } = useSnackbar();
  type ModalContent = {
    component: React.ElementType;
    props?: Record<string, any>;
  } | null;

  const [modalContent, setModalContent] = useState<ModalContent>(null);
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null);

  const noSplit = useMemo(
    () => leftTabs.some((tab: TabData) => tab.tool === 'event'),
    [leftTabs]
  );

  useEffect(() => {
    if (noSplit && preventSplit === false) {
      setPreventSplit(true);
    }
  }, [noSplit, preventSplit, setPreventSplit]);

  const moveRTL = useCallback(
    (entry: TabData) => {
      if (rightTabs.some((tab: TabData) => tab.tabId === entry.tabId)) {
        moveLeft(entry.tabId);
      } else {
        addNewTab({ ...entry, side: 'left' });
      }
    },
    [rightTabs, moveLeft, addNewTab]
  );

  const moveLTR = useCallback(
    (entry: TabData) => {
      console.log('moveLTR', entry);
      if (preventSplit) {
        showSnackbar(
          'Split view is disabled for Events, APTs, and Story Threads.',
          'error',
          5000
        );
        return;
      }
      if (leftTabs.some((tab: TabData) => tab.tabId === entry.tabId)) {
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
        <TabDragProvider>
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
              }}
              className="tab-header"
            >
              <RenderTabHeaders
                isSplit={isSplit}
                tabs={leftTabs}
                currentTab={currentLeftTab}
                setActiveTab={setActiveTab}
                removeById={removeById}
                setDragSide={setDragSide}
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
                    left: [0, '50%', '50%', 'calc(50% + 174px)'],
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.default',
                    border: '2px solid #000',
                    borderColor: 'secondary.light',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 4,
                    boxSizing: 'border-box',
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
              {dragSide === 'left' && (
                <TabDragBox side="left" moveFn={moveRTL} />
              )}
              {dragSide === 'right' && (
                <TabDragBox side="right" moveFn={moveLTR} />
              )}

              <LeftTabsProvider>
                <RenderTabs
                  side="left"
                  setModalContent={setModalContent}
                  moveFn={moveRTL}
                />
              </LeftTabsProvider>
              {(useSelector(select.rightTabs) as TabData[]).length > 0 && (
                <>
                  <Divider flexItem orientation="vertical" />
                  <RightTabsProvider>
                    <RenderTabs
                      side="right"
                      setModalContent={setModalContent}
                      moveFn={moveLTR}
                    />
                  </RightTabsProvider>
                </>
              )}
            </Box>
          </Box>
        </TabDragProvider>
      </Box>
    </Box>
  );
};

export default TabbedContainer;
