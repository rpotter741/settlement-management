import React, { useEffect, useState, useReducer } from 'react';

import { Box, Divider, Tab, Tabs } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';

import AttrMetaData from '../forms/AttrMetaData.jsx';
import AttrValues from '../forms/AttrValues.jsx';
import SettlementPointsCost from '../forms/SPC.jsx';
import ObjectThresholds from 'components/shared/Metadata/Thresholds.jsx';
import TagTable from '../forms/TagTable.jsx';

import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import AttrProperties from '../forms/AttrProperties.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';
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
import { usePageBoxContext } from '@/context/PageBox.js';

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
  const { side, tab } = useShellContext();
  const { both } = useTabSplit();
  const dispatch: AppDispatch = useDispatch();
  const [localState, localDispatch] = useReducer(
    editAttrReducer,
    tab.viewState.editAttr || defaultViewState
  );

  const { activeTab, editTabs, lastIndex } = localState;

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
          side,
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

  const { ref, height } = usePageBoxContext();

  return (
    <Box
      id={`edit-attribute-${tab.id}`}
      ref={ref}
      sx={{
        height: '100%',
        transition: 'height 0.4s ease-in-out',
        overflow: typeof height === 'number' ? 'hidden' : 'auto',
        width: '100%',
        px: 2,
        boxSizing: 'border-box',
      }}
    >
      <TabbedContent
        tabs={Object.values(editTabs).map((tab: TabbedContentTabs) => ({
          ...tab,
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
