import PageBox from '@/components/shared/Layout/PageBox/PageBox.js';
import TabbedContent from '@/components/shared/Layout/TabbedContent/TabbedContent.js';
import { Box, Select, TextField } from '@mui/material';
import { ComponentType, useEffect, useMemo, useState } from 'react';
import SubTypeFormPreview from './previews/SubTypeFormPreview.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';
import { useShellContext } from '@/context/ShellContext.js';
import ChangeSubTypeSelect from './inputs/ChangeSubTypeSelect.js';
import { debounce } from 'lodash';
import { dispatch } from '@/app/constants.js';
import renameNodeAndEntryThunk from '@/app/thunks/glossary/nodes/renameNodeAndEntryThunk.js';
import { SubTypeGroup, SubTypeGroupLink } from '@/app/slice/subTypeSlice.js';
import { useSelector } from 'react-redux';
import { selectSubTypeGroups } from '@/app/selectors/subTypeSelectors.js';

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

  console.log(source);

  const [name, setName] = useState<string>(
    source?.name || `New ${subType.name} Entry`
  );

  const allGroups = useSelector(selectSubTypeGroups);

  const tabs = useMemo(() => {
    console.log('generating tabs');
    console.log(subType?.name);
    if (!subType) return [];
    return subType.groups.map((groupLink: SubTypeGroupLink) => {
      const group = allGroups.find(
        (g: SubTypeGroup) => g.id === groupLink.groupId
      );
      return {
        name: group?.displayName || '',
        key: group?.id || '',
        props: {
          glossaryId,
          mode,
          group,
          source,
          onAddData,
          handleChange,
          onRemove,
          disableResize,
          liveEdit,
          subType,
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
    console.log('redrawing component map');
    return tabs.reduce((acc: Record<string, ComponentType<any>>, tab: any) => {
      acc[tab.name] = SubTypeFormPreview;
      return acc;
    }, {});
  }, [subType, source]);

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
