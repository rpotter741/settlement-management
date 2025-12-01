import PageBox from '@/components/shared/Layout/PageBox/PageBox.js';
import TabbedContent from '@/components/shared/Layout/TabbedContent/TabbedContent.js';
import { Box, Select, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import SubTypeFormPreview from './previews/SubTypeFormPreview.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';
import { useShellContext } from '@/context/ShellContext.js';
import ChangeSubTypeSelect from './inputs/ChangeSubTypeSelect.js';
import { debounce } from 'lodash';
import { dispatch } from '@/app/constants.js';
import renameNodeAndEntryThunk from '@/app/thunks/glossary/nodes/renameNodeAndEntryThunk.js';

const PreviewOrchestrator = ({
  subType,
  mode,
  editId,
  mt = 6,
  disableResize = false,
  offerSubTypeChange = false,
  glossaryId,
}: {
  subType: any;
  mode: 'focus' | 'form' | 'preview';
  editId: string | null;
  mt?: number;
  disableResize?: boolean;
  offerSubTypeChange?: boolean;
  glossaryId?: string | null;
}) => {
  const {
    source,
    setSource,
    handleChange,
    onAddData,
    onRemove,
    liveEdit,
    node,
    tabId,
  } = useShellContext();

  const [name, setName] = useState<string>(
    source?.name || `New ${subType.name} Entry`
  );

  const tabs = useMemo(() => {
    return subType.groupOrder.map((groupId: string) => {
      const group = subType.groupData[groupId];
      return {
        name: group.name,
        key: groupId,
        props: {
          subType,
          groupId,
          mode,
          source,
          editId,
          handleChange,
          setSource,
          onAddData,
          onRemove,
          disableResize,
          liveEdit,
          glossaryId,
        },
      };
    });
  }, [subType, source]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);

  const handleTabClick = (tabKey: string, index: number) => {
    setActiveTab(tabKey);
    setLastIndex(activeIndex);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (tabs.length && !tabs.find((tab: any) => tab.key === activeTab)) {
      setActiveTab(tabs[0].key);
      setActiveIndex(0);
    }
  }, [tabs, activeTab]);

  const componentMap = useMemo(() => {
    return tabs.reduce((acc: GenericObject, tab: any) => {
      acc[tab.name] = SubTypeFormPreview;
      return acc;
    }, {});
  }, [subType]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((updatedName: string, nodeToUpdate: any) => {
        dispatch(
          renameNodeAndEntryThunk({
            node: { ...nodeToUpdate, name: updatedName },
            tabId,
          })
        );
      }, 300),
    []
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    // pass the latest values to the stable debounced function
    if (liveEdit) debouncedUpdate(newName, node);
  };

  return (
    //@ts-ignore
    <PageBox mode="edit" variant="default" outerStyle={{ mt }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 4 }}>
        <TextField
          variant="outlined"
          fullWidth
          label="Name"
          value={name}
          onChange={handleNameChange}
        />
        <ChangeSubTypeSelect disabled={!offerSubTypeChange} editId={editId} />
      </Box>
      <TabbedContent
        tabs={tabs}
        componentMap={componentMap}
        activeTab={activeTab}
        handleTabClick={(tabName, index) => handleTabClick(tabName, index)}
        lastIndex={lastIndex}
        isTool={false}
      />
    </PageBox>
  );
};

export default PreviewOrchestrator;
