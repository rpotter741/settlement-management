import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  addTab,
  removeTab,
  setCurrentTab,
  setBreadcrumbs,
  updateTab,
} from 'features/sidePanel/sidePanelSlice.js';
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
    }) => {
      dispatch(addTab({ name, id, mode, type, tabId, scroll, activate }));
    },
    [dispatch]
  );

  const removeById = useCallback(
    (tabId) => {
      dispatch(removeTab({ tabId }));
    },
    [dispatch]
  );

  const setActiveTab = useCallback(
    (index, tabId) => {
      console.log(index, tabId);
      dispatch(setCurrentTab({ index, tabId }));
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
    (index, updates) => {
      dispatch(updateTab({ index, updates }));
    },
    [dispatch]
  );

  return {
    addNewTab,
    removeById,
    setActiveTab,
    updateBreadcrumbs,
    updateCurrentTab,
  };
};

const useSidePanelSelectors = () => {
  const tabs = useSelector(select.tabs);
  const currentTab = useSelector(select.currentTab);
  const currentIndex = useSelector(select.currentIndex);
  const breadcrumbs = useSelector(select.breadcrumbs);

  return {
    tabs,
    currentTab,
    currentIndex,
    breadcrumbs,
  };
};

export const useSidePanel = () => {
  const selectors = useSidePanelSelectors();
  const actions = useSidePanelActions();
  return { ...selectors, ...actions };
};
