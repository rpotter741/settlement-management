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
} from 'features/sidePanel/sidePanelSlice.ts';
import { sidePanelSelectors as select } from 'features/SidePanel/sidePanelSelectors.js';

export const useSidePanelActions = () => {
  const dispatch = useDispatch();

  const addNewTab = useCallback(
    ({
      name = 'Untitled',
      id,
      mode,
      type,
      tabId,
      scroll,
      activate = false,
      side,
    }) => {
      dispatch(addTab({ name, id, mode, type, tabId, scroll, activate, side }));
    },
    [dispatch]
  );

  const removeById = useCallback(
    (tabId, side, preventSplit) => {
      dispatch(removeTab({ tabId, side, preventSplit }));
    },
    [dispatch]
  );

  const setActiveTab = useCallback(
    (index, tabId, side) => {
      dispatch(setCurrentTab({ index, tabId, side }));
    },
    [dispatch]
  );

  const updateBreadcrumbs = useCallback(
    (breadcrumbs) => {
      dispatch(setBreadcrumbs({ breadcrumbs }));
    },
    [dispatch]
  );

  const updateCurrentTab = useCallback(
    (index, updates, side) => {
      dispatch(updateTab({ index, updates, side }));
    },
    [dispatch]
  );

  const moveLeft = useCallback(
    (tabId, dropIndex) => {
      dispatch(moveRightToLeft({ tabId, dropIndex }));
    },
    [dispatch]
  );

  const moveRight = useCallback(
    (tabId, dropIndex) => {
      dispatch(moveLeftToRight({ tabId, dropIndex }));
    },
    [dispatch]
  );

  const setOptions = useCallback((options) => {
    dispatch(setToolOptions({ options }));
  });

  const setSplitState = useCallback((split) => {
    dispatch(setSplit({ split }));
  });

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
  const breadcrumbs = useSelector(select.breadcrumbs);
  const options = useSelector(select.options);
  const getOptions = (keypath) => useSelector(select.selectOptions(keypath));

  return {
    leftTabs,
    rightTabs,
    currentLeftTab,
    currentRightTab,
    currentLeftIndex,
    currentRightIndex,
    isSplit,
    preventSplit,
    breadcrumbs,
    options,
    getOptions,
  };
};

export const useSidePanel = () => {
  const selectors = useSidePanelSelectors();
  const actions = useSidePanelActions();

  useEffect(() => {
    if (selectors.rightTabs.length > 0) {
      if (selectors.isSplit === false) {
        actions.setSplitState({ split: true });
      }
    }
  });

  return { ...selectors, ...actions };
};
