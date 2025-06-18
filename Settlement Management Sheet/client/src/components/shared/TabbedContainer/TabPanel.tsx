import React, { useEffect } from 'react';
import { alpha, Box, useTheme } from '@mui/material';
import FileMenu from './FileMenu.js';
import { Tab } from '@/app/types/SidePanelTypes.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '@/app/slice/sidePanelSlice.js';
import { set } from 'lodash';
import { focusedTab } from '@/app/selectors/sidePanelSelectors.js';
import { useSelector } from 'react-redux';

interface TabPanelProps {
  children: React.ReactNode;
  tab: Tab;
  value: string | null;
}

const TabPanel: React.FC<TabPanelProps> = React.memo(
  ({ children, value, tab }) => {
    const dispatch: AppDispatch = useDispatch();

    if (value !== tab.tabId) return null;

    const activeTab = useSelector(focusedTab);

    useEffect(() => {
      dispatch(setActiveTab({ tab }));
    }, [tab.side, tab.tabId, dispatch]);

    return (
      <Box
        role="tabpanel"
        id={`tabpanel-${tab.tabId}`}
        aria-labelledby={`tab-${tab.tabId}`}
        sx={{
          height: '100%',
          width: '100%',
          flexGrow: 1,
          pt: tab.disableMenu ? 4 : 0,
        }}
        onClick={() => {
          if (activeTab?.tabId !== tab.tabId) {
            dispatch(setActiveTab({ tab }));
          }
        }}
      >
        {!tab.disableMenu && <FileMenu tab={tab} />}
        {children}
      </Box>
    );
  }
);

export default TabPanel;
