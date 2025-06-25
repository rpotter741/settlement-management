import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  Suspense,
  act,
} from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Modal, useMediaQuery } from '@mui/material';

import SidePanel from '@/features/SidePanel/SidePanel.jsx';
import { useSidePanel } from '@/hooks/useSidePanel.jsx';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';

import { TabDragProvider } from '@/context/DnD/TabDragContext.jsx';
import TabDragBox from './TabDragBox.js';

import RenderTabHeaders from './RenderTabHeaders.jsx';
import RenderTabs from './RenderTabs.jsx';
import {
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
import GeographyForm from '@/features/Glossary/LandmarkForm/CreateLandmarkGlossary.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import useToolHotkeys from '@/hooks/useGlobalHotkeys.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';
import {
  currentModal,
  currentModalKey,
  isModalOpen,
  modalPositionSx,
  modalProps,
  disableBackgroundClose,
} from '@/app/selectors/modalSelectors.js';
import { closeModal } from '@/app/slice/modalSlice.js';
import { modalMap } from '@/maps/modalMap.js';
import { useModalActions } from '@/hooks/useModal.js';
import { saveToolFile } from '@/app/thunks/fileMenuThunks.js';

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

  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null);

  const activeTab = useSelector(focusedTab);

  const { showModal } = useModalActions();

  const modalOpen = useSelector(isModalOpen);
  const ModalComponent = useSelector(currentModal);
  const modalKey = useSelector(currentModalKey);
  const modalComponentProps = useSelector(modalProps);
  const modalPosition = useSelector(modalPositionSx);
  const disableClickaway = useSelector(disableBackgroundClose);

  const noSplit = useMemo(
    () => leftTabs.some((tab: Tab) => tab.tool === 'event'),
    [leftTabs]
  );

  const canSplit = useMediaQuery('(min-width:1536px)');

  useEffect(() => {
    if (canSplit && !noSplit) {
      setPreventSplit(false);
    } else {
      setPreventSplit(true);
    }
  }, [canSplit, noSplit, setPreventSplit]);

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
    'mod+shift+p': () => {
      if (!activeTab) return;
      dispatch(
        updateTab({
          tabId: activeTab?.tabId || '',
          side: activeTab?.side || 'left',
          keypath: 'mode',
          updates: 'preview',
        })
      );
    },
    'mod+shift+e': () => {
      if (!activeTab) return;
      dispatch(
        updateTab({
          tabId: activeTab?.tabId || '',
          side: activeTab?.side || 'left',
          keypath: 'mode',
          updates: 'edit',
        })
      );
    },
    'mod+w': () => {
      if (!activeTab) return;
      if (activeTab.isDirty) {
        const entry = {
          componentKey: 'ConfirmDirtyClose',
          props: {
            tab: activeTab,
          },
          id: `confirm-dirty-close-${activeTab.tabId}`,
        };
        showModal({ entry });
      } else {
        removeById(activeTab.tabId, activeTab.side, false);
      }
    },
    'mod+k': () => {
      const entry = {
        componentKey: 'QuickSearch',
        props: {},
        id: 'quick-search',
      };
      showModal({ entry });
    },
    'mod+s': () => {
      if (!activeTab) return;
      dispatch(saveToolFile(activeTab));
    },
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
        <SidePanel />
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
                />
              </LeftTabsProvider>
              {rightTabs.length > 0 && (
                <RightTabsProvider>
                  <RenderTabHeaders
                    setActiveTab={setActiveTab}
                    removeById={removeById}
                    side="right"
                  />
                </RightTabsProvider>
              )}
            </Box>
            {modalOpen && (ModalComponent || modalKey) && (
              <Modal
                open={true}
                onClose={
                  disableClickaway
                    ? undefined
                    : () => dispatch(closeModal({ autoNext: false }))
                }
              >
                <Box sx={{ ...modalPosition }}>
                  <Suspense fallback={<Box>Loading...</Box>}>
                    {(() => {
                      const LazyComponent = modalKey
                        ? modalMap[modalKey]
                        : ModalComponent;

                      return LazyComponent ? (
                        <LazyComponent {...modalComponentProps} />
                      ) : null;
                    })()}
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
                <RenderTabs side="left" />
              </LeftTabsProvider>
              {(useSelector(select.rightTabs) as Tab[]).length > 0 && (
                <>
                  <Divider flexItem orientation="vertical" />
                  <RightTabsProvider>
                    <RenderTabs side="right" />
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
