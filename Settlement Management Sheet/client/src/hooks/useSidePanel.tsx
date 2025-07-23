import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  addTab,
  removeTab,
  setCurrentTab,
  setBreadcrumbs,
  updateTab,
  moveLeftToRight,
  moveRightToLeft,
  setToolOptions,
  setSplit,
  setPrevent,
} from '@/app/slice/sidePanelSlice.js';
import { sidePanelSelectors as select } from '../app/selectors/sidePanelSelectors.js';
import { TabDataPayload } from '@/app/types/ToolTypes.js';
import { OptionObject, TabTools } from '@/app/types/SidePanelTypes.js';
import { set } from 'lodash';
import { v4 as newId } from 'uuid';

export type SidePanelSide = 'left' | 'right';

export const useSidePanelActions = () => {
  const dispatch = useDispatch();

  const addNewTab = useCallback(
    ({
      name = 'Untitled',
      id,
      mode,
      tool,
      tabId = newId(),
      scroll = 0,
      activate = false,
      side,
      preventSplit = false,
      tabType = 'tool',
      disableMenu = false,
      glossaryId = undefined,
    }: Partial<TabDataPayload>) => {
      dispatch(
        addTab({
          name,
          id: id as string,
          mode: mode as 'preview' | 'edit',
          tool: tool as TabTools,
          tabId,
          scroll,
          activate,
          side,
          preventSplit,
          tabType,
          disableMenu,
          glossaryId,
        })
      );
    },
    [dispatch]
  );

  const removeById = useCallback(
    (tabId: string, side: SidePanelSide, preventSplit: boolean) => {
      dispatch(removeTab({ tabId, side, preventSplit }));
    },
    [dispatch]
  );

  const setActiveTab = useCallback(
    (index: number, tabId: string, side: SidePanelSide) => {
      dispatch(setCurrentTab({ index, tabId, side }));
    },
    [dispatch]
  );

  const updateBreadcrumbs = useCallback(
    (breadcrumbs: string[]) => {
      dispatch(setBreadcrumbs({ breadcrumbs }));
    },
    [dispatch]
  );

  const updateCurrentTab = useCallback(
    (tabId: string, keypath: string, updates: any, side: SidePanelSide) => {
      dispatch(updateTab({ tabId, keypath, updates, side }));
    },
    [dispatch]
  );

  const moveLeft = useCallback(
    (tabId: string, dropIndex: number) => {
      dispatch(moveRightToLeft({ tabId, dropIndex }));
    },
    [dispatch]
  );

  const moveRight = useCallback(
    (tabId: string, dropIndex: number) => {
      dispatch(moveLeftToRight({ tabId, dropIndex }));
    },
    [dispatch]
  );

  const setOptions = useCallback(
    (options: Record<string, OptionObject[]>) => {
      dispatch(setToolOptions({ options }));
    },
    [dispatch]
  );

  const setSplitState = useCallback(
    (split: boolean) => {
      dispatch(setSplit({ split }));
    },
    [dispatch]
  );

  const setPreventSplit = useCallback(
    (prevent: boolean) => {
      dispatch(setPrevent({ prevent }));
    },
    [dispatch]
  );

  return {
    addNewTab,
    removeById,
    setActiveTab,
    updateBreadcrumbs,
    updateCurrentTab,
    moveLeft,
    moveRight,
    setOptions,
    setSplitState,
    setPreventSplit,
  };
};

const useSidePanelSelectors = () => {
  const leftTabs = useSelector(select.leftTabs);
  const rightTabs = useSelector(select.rightTabs);
  const currentLeftTab = useSelector(select.currentLeftTab);
  const currentRightTab = useSelector(select.currentRightTab);
  const currentLeftIndex = useSelector(select.currentLeftIndex);
  const currentRightIndex = useSelector(select.currentRightIndex);
  const isSplit = useSelector(select.isSplit);
  const preventSplit = useSelector(select.preventSplit);
  const options = useSelector(select.options);

  return {
    leftTabs,
    rightTabs,
    currentLeftTab,
    currentRightTab,
    currentLeftIndex,
    currentRightIndex,
    isSplit,
    preventSplit,
    options,
  };
};

export const useSidePanel = () => {
  const selectors = useSidePanelSelectors();
  const actions = useSidePanelActions();

  return { ...selectors, ...actions };
};
