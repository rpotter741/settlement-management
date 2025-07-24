import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PageBox from '@/components/shared/Layout/PageBox/PageBox.js';
import {
  selectActiveId,
  selectGlossaryById,
} from '@/app/selectors/glossarySelectors.js';
import { Box, Button } from '@mui/material';
import { useModalActions } from '@/hooks/global/useModal.js';
import CustomizePalette from '../forms/CustomizePalette.js';
import TabbedContent from '@/components/shared/Layout/TabbedContent/TabbedContent.js';
import EditGlossaryOverviewTab from './OverviewTab.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import { Tab } from '@/app/types/SidePanelTypes.js';

const EditGlossary: React.FC<{ tab: Tab }> = ({ tab }) => {
  const activeId = useSelector(selectActiveId());
  console.log('activeId', activeId, tab);
  if (!activeId) return null;
  const glossary = useSelector(selectGlossaryById(activeId));
  const { showModal } = useModalActions();
  const [activeTab, setActiveTab] = useState('Overview');
  const [lastIndex, setLastIndex] = useState(0);
  const handleTabClick = (tabKey: string, index: number) => {
    setActiveTab(tabKey);
    setLastIndex(index);
  };
  const editGlossaryTabs = [
    { name: 'Overview', props: {} },
    { name: 'Terms', props: {} },
    { name: 'Settings', props: {} },
    { name: 'Palette', props: {} },
  ];

  const editGlossaryComponentMap = useMemo(
    () => ({
      Overview: () => <EditGlossaryOverviewTab />,
      Terms: () => <div>Terms Component</div>,
      Settings: () => <div>Settings Component</div>,
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
          overflowY: 'scroll',
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
        <Button
          onClick={() => {
            const entry = {
              componentKey: 'ConfirmDeleteGlossary',
              props: {
                tab: activeTab,
                glossary,
              },
              id: `delete-glossary-${glossary.id}`,
            };
            showModal({ entry });
          }}
        >
          Delete Glossary
        </Button>
      </Box>
    </PageBox>
  );
};

export default EditGlossary;
