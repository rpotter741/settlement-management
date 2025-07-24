import React, { useEffect } from 'react';
import { alpha, Box, useTheme } from '@mui/material';
import FileMenu from './FileMenu.js';
import { Tab } from '@/app/types/SidePanelTypes.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '@/app/slice/sidePanelSlice.js';
import { focusedTab } from '@/app/selectors/sidePanelSelectors.js';
import { useSelector } from 'react-redux';
import useTabSplit from '@/hooks/layout/useTabSplit.js';

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
          maxHeight: 'calc(100vh - 48px)',
          width: '100%',
          pt: tab.disableMenu ? 5 : 0,
          backgroundColor:
            tab.mode !== 'edit' ? 'background.default' : 'background.paper',
          transition: 'background-color 0.3s ease',
        }}
        onClick={() => {
          if (activeTab?.tabId !== tab.tabId) {
            dispatch(setActiveTab({ tab }));
          }
        }}
      >
        {!tab.disableMenu && <FileMenu tab={tab} />}
        <Box
          id={`tab-panel-child-box-${tab.tabId}`}
          sx={{ display: 'flex', height: '100%' }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);

export default TabPanel;
