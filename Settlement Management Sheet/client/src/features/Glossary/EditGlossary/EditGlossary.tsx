import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PageBox from '@/components/shared/Layout/PageBox/PageBox.js';
import {
  selectActiveId,
  selectEditGlossaryById,
} from '@/app/selectors/glossarySelectors.js';
import { Box, Button } from '@mui/material';
import { useModalActions } from '@/hooks/global/useModal.js';
import CustomizePalette from './CustomizePalette.js';
import TabbedContent from '@/components/shared/Layout/TabbedContent/TabbedContent.js';
import EditGlossaryOverviewTab from './GlossaryOverviewTab.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import { Tab } from '@/app/types/TabTypes.js';
import GlossaryTerms from '../Terms/GlossaryTermsTab.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { updateTab } from '@/app/slice/tabSlice.js';
import GlossaryPropertyLabels from '../utils/propertyMaps/GlossaryPropertyLabels.js';
import GlossaryTermsTab from '../Terms/GlossaryTermsTab.js';

const EditGlossary: React.FC<{ tab: Tab }> = ({ tab }) => {
  if (!tab.glossaryId) return null;
  const dispatch: AppDispatch = useDispatch();
  const glossary = useSelector(selectEditGlossaryById(tab.glossaryId));
  const [activeTab, setActiveTab] = useState(
    tab.viewState?.tabData?.activeTab || 'Overview'
  );
  const [activeIndex, setActiveIndex] = useState(
    tab.viewState?.tabData?.activeTermIndex || 0
  );
  const [lastIndex, setLastIndex] = useState(
    tab.viewState?.tabData?.activeIndex || 0
  );
  const handleTabClick = (tabKey: string, index: number) => {
    setActiveTab(tabKey);
    setLastIndex(activeIndex);
    setActiveIndex(index);
  };

  useEffect(() => {
    return () => {
      dispatch(
        updateTab({
          tabId: tab.tabId,
          side: tab.side,
          keypath: 'viewState.tabData',
          updates: {
            activeTab,
            activeIndex: activeIndex,
          },
        })
      );
    };
  }, [dispatch, tab.tabId, tab.side, activeTab, activeIndex]);

  const editGlossaryTabs = [
    { name: 'Overview', props: { tab } },
    { name: 'Terms', props: { tab } },
    { name: 'Settings', props: { tab } },
    { name: 'Templates', props: { tab } },
    { name: 'Palette', props: { tab } },
  ];

  const editGlossaryComponentMap = useMemo(
    () => ({
      Overview: () => <EditGlossaryOverviewTab glossary={glossary} tab={tab} />,
      Terms: () => <GlossaryTermsTab tab={tab} />,
      Settings: () => <div>Settings Component</div>,
      Templates: () => <Box>Templates Component</Box>,
      Palette: () => <CustomizePalette column={false} />,
    }),
    []
  );
  const { splitSize, soloSize, splitTabs } = useTabSplit();

  return (
    <PageBox
      mode={'edit'}
      variant={
        !splitTabs
          ? soloSize
            ? 'blend'
            : 'default'
          : splitSize
            ? 'default'
            : 'blend'
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          mt: 2,
          alignContent: 'start',
          justifyContent: 'start',
          gap: 2,
          height: '100%',
          borderRadius: 2,
          boxSizing: 'border-box',
          overflow: 'none',
          width: '100%',
          px: 2,
        }}
      >
        <TabbedContent
          tabs={editGlossaryTabs}
          componentMap={editGlossaryComponentMap}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          lastIndex={lastIndex}
          isTool={false}
        />
      </Box>
    </PageBox>
  );
};

export default EditGlossary;
