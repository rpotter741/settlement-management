import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  Suspense,
} from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Modal } from '@mui/material';

import SidePanel from '@/features/SidePanel/SidePanel.jsx';
import { useSidePanel } from '@/hooks/useSidePanel.jsx';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';

import { TabDragProvider } from '@/context/DnD/TabDragContext.jsx';
import TabDragBox from './TabDragBox.js';

import RenderTabHeaders from './RenderTabHeaders.jsx';
import RenderTabs from './RenderTabs.jsx';
import {
  activeTab,
  focusedTab,
  sidePanelSelectors as select,
  selectAllTabs,
} from '@/app/selectors/sidePanelSelectors.js';

import {
  LeftTabsProvider,
  RightTabsProvider,
} from '@/context/TabsContext/TabsContext.jsx';
import { TabDataPayload } from '@/app/types/ToolTypes.js';
import { Tab } from '@/app/types/SidePanelTypes.js';
import GeographyForm from '@/features/Glossary/forms/GeographyForm.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import useToolHotkeys from '@/hooks/useGlobalHotkeys.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';

export type ModalContent = {
  component: React.ElementType;
  props?: Record<string, any>;
} | null;

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
    setSplitState: setSplit,
    moveLeft,
    moveRight,
    preventSplit,
    setPreventSplit,
  } = useSidePanel();
  const dispatch: AppDispatch = useDispatch();

  const [modalContent, setModalContent] = useState<ModalContent>(null);
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null);
  const activeTab = useSelector(focusedTab);

  const noSplit = useMemo(
    () => leftTabs.some((tab: Tab) => tab.tool === 'event'),
    [leftTabs]
  );

  useEffect(() => {
    if (noSplit && preventSplit === false) {
      setPreventSplit(true);
    }
  }, [noSplit, preventSplit, setPreventSplit]);

  const moveRTL = useCallback(
    (entry: TabDataPayload, dropIndex: number) => {
      if (rightTabs.some((tab: Tab) => tab.tabId === entry.tabId)) {
        moveLeft(entry.tabId, dropIndex);
      } else {
        addNewTab({ ...entry, side: 'left' });
      }
    },
    [rightTabs, moveLeft, addNewTab]
  );

  const moveLTR = useCallback(
    (entry: TabDataPayload, dropIndex: number) => {
      console.log('moveLTR', entry);
      if (preventSplit) {
        dispatch(
          showSnackbar({
            message:
              'Split view is disabled for Events, APTs, and Story Threads.',
            type: 'error',
            duration: 5000,
          })
        );
        return;
      }
      if (leftTabs.some((tab: Tab) => tab.tabId === entry.tabId)) {
        moveRight(entry.tabId, dropIndex);
      } else {
        addNewTab({ ...entry, side: 'right' });
      }
    },
    [leftTabs, moveRight, addNewTab, preventSplit, showSnackbar]
  );

  useEffect(() => {
    if (rightTabs.length > 0 && leftTabs.length === 0) {
      moveLeft(rightTabs[0].tabId, 0);
    }
  }, [rightTabs, leftTabs]);

  useEffect(() => {
    if (rightTabs.length > 0) {
      if (isSplit === false) {
        setSplit(true);
      }
    }
  }, [isSplit, rightTabs, setSplit]);

  useToolHotkeys(activeTab, {
    tool: {
      'mod+shift+p': () =>
        dispatch(
          updateTab({
            tabId: activeTab?.tabId || '',
            side: activeTab?.side || 'left',
            keypath: 'mode',
            updates: 'preview',
          })
        ),
      'mod+shift+e': () =>
        dispatch(
          updateTab({
            tabId: activeTab?.tabId || '',
            side: activeTab?.side || 'left',
            keypath: 'mode',
            updates: 'edit',
          })
        ),
      'mod+w': () => {
        if (!activeTab) return;
        const freshTab = [...leftTabs, ...rightTabs].find(
          (tab: Tab) => tab.tabId === activeTab.tabId
        );
        if (!freshTab) return;
        if (freshTab.isDirty) {
          setModalContent({
            component: React.lazy(
              () =>
                import(
                  '@/components/shared/TabbedContainer/ConfirmDirtyClose.jsx'
                )
            ),
            props: {
              onClose: () => removeById(freshTab.tabId, freshTab.side, false),
              tab: freshTab,
              side: freshTab.side,
              setModalContent,
            },
          });
        } else {
          removeById(activeTab.tabId, activeTab.side, false);
        }
      },
    },
    glossary: {},
    other: {},
  });

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
              <LeftTabsProvider>
                <RenderTabHeaders
                  setActiveTab={setActiveTab}
                  removeById={removeById}
                  setDragSide={setDragSide}
                  setModalContent={setModalContent}
                />
              </LeftTabsProvider>
              {rightTabs.length > 0 && (
                <RightTabsProvider>
                  <RenderTabHeaders
                    setActiveTab={setActiveTab}
                    removeById={removeById}
                    side="right"
                    setModalContent={setModalContent}
                  />
                </RightTabsProvider>
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
                <RenderTabs side="left" setModalContent={setModalContent} />
              </LeftTabsProvider>
              {(useSelector(select.rightTabs) as Tab[]).length > 0 && (
                <>
                  <Divider flexItem orientation="vertical" />
                  <RightTabsProvider>
                    <RenderTabs
                      side="right"
                      setModalContent={setModalContent}
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
