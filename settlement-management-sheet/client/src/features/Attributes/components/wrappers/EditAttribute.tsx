import React, { useEffect, useReducer } from 'react';
import { Box } from '@mui/material';
import AttrValues from '../forms/AttrValues.jsx';
import SettlementPointsCost from '../forms/SPC.jsx';
import ObjectThresholds from 'components/shared/Metadata/Thresholds.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import AttrProperties from '../forms/AttrProperties.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import { updateTab } from '@/app/slice/tabSlice.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import {
  AttrPropertyTypes,
  editAttrReducer,
  editAttrState as defaultViewState,
  setActiveTab,
} from '../../state/editReducer.js';
import TabbedContent, {
  TabbedContentTabs,
} from '@/components/shared/Layout/TabbedContent/TabbedContent.js';
import { useAutosave } from '@/hooks/utility/useAutosave/useAutosave.js';
import toolAutosaveConfig from '@/hooks/utility/useAutosave/configs/toolConfig.js';

interface EditAttributeProps {}

const editAttrComponentMap: Record<string, React.ComponentType<any>> = {
  Properties: AttrProperties,
  Values: AttrValues,
  SPC: SettlementPointsCost,
  Thresholds: ObjectThresholds,
  Currency: () => <Box>Currency Component</Box>,
  Gather: () => <Box>Gather Component</Box>,
  Upkeep: () => <Box>Upkeep Component</Box>,
};

const EditAttribute: React.FC<EditAttributeProps> = () => {
  const { tab, id } = useShellContext();
  const { both } = useTabSplit();
  const dispatch: AppDispatch = useDispatch();
  const [localState, localDispatch] = useReducer(
    editAttrReducer,
    tab.viewState.editAttr || defaultViewState
  );

  const { activeTab, editTabs, lastIndex } = localState;

  useAutosave(
    toolAutosaveConfig({
      name: tab.name,
      tool: 'attribute',
      id,
      tabId: tab.tabId,
      side: tab.side,
    })
  );

  useEffect(() => {
    if (tab.lastTab && tab.lastIndex) {
      localDispatch(setActiveTab(tab.lastTab, tab.lastIndex));
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(
        updateTab({
          tabId: tab.tabId,
          keypath: 'viewState.editAttr',
          updates: { ...localState },
        })
      );
    };
  }, [localState]);

  const columns = both ? 1 : 2;

  const handleTabClick = (name: string, index: number) => {
    localDispatch(setActiveTab(name as AttrPropertyTypes, index));
  };

  return (
    <Box
      id={`edit-attribute-${tab.id}`}
      sx={{
        height: '100%',
        transition: 'height 0.4s ease-in-out',
        overflow: 'auto',
        width: '100%',
        px: 2,
        boxSizing: 'border-box',
      }}
    >
      <TabbedContent
        tabs={Object.values(editTabs).map((tab: TabbedContentTabs) => ({
          ...tab,
          key: tab.name,
          disabled: tab.disabled || false,
          props: {
            localDispatch,
          },
        }))}
        componentMap={editAttrComponentMap}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        columns={columns}
        lastIndex={lastIndex}
      />
    </Box>
  );
};

export default EditAttribute;
