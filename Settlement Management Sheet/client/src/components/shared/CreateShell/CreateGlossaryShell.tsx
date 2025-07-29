import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ShellContext } from '@/context/ShellContext.js';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store.js';
import { Tab } from '@/app/types/TabTypes.js';
import PageBox from '../Layout/PageBox/PageBox.js';
import {
  selectActiveId,
  selectGlossaryNodes,
} from '@/app/selectors/glossarySelectors.js';
import { updateTab } from '@/app/slice/tabSlice.js';
import useNodeEditor from '@/hooks/glossary/useNodeEditor.js';
import { cloneDeep, get } from 'lodash';
import { useModalActions } from '@/hooks/global/useModal.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import { getOptionsContextMaps } from '@/utility/hasParentProperty.js';

interface CreateGlossaryShellProps {
  tab: Tab;
  editComponent?: React.ComponentType<any>;
  editComponentProps?: Record<string, any>;
  previewComponent?: React.ComponentType<any>;
  previewComponentProps?: Record<string, any>;
  pageVariant?: 'default' | 'fullWidth';
}

const CreateGlossaryShell: React.FC<CreateGlossaryShellProps> = ({
  tab,
  editComponent,
  editComponentProps,
  previewComponent,
  previewComponentProps,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { showModal, closeModal } = useModalActions();
  const { tool, id, mode, side, tabId, glossaryId, tabType } = tab;

  const updateLastSaved = (keypath: string) => {
    const lastSaved = cloneDeep(tab.viewState.lastSaved || {});
    lastSaved[keypath] = new Date().toISOString();
    dispatch(
      updateTab({
        tabId,
        side,
        keypath: 'viewState.lastUpdated',
        updates: lastSaved,
      })
    );
  };

  if (!glossaryId) return null;

  const { node, entry } = useNodeEditor(glossaryId, id);

  const nodeStructure = useSelector(selectGlossaryNodes(glossaryId));

  const inheritanceMap = useMemo(() => {
    return getOptionsContextMaps({ node, nodeStructure });
  }, [node, nodeStructure]);

  const { splitSize, soloSize, splitTabs } = useTabSplit();

  const shellContextValue = useMemo(
    () => ({
      tab,
      tool,
      id,
      mode,
      side,
      tabId,
      glossaryId,
      entry,
      node,
      inheritanceMap,
      updateLastSaved,
      showModal,
      closeModal,
    }),
    [
      tab,
      tool,
      id,
      mode,
      side,
      tabId,
      glossaryId,
      entry,
      updateLastSaved,
      showModal,
      closeModal,
      node,
      inheritanceMap,
    ]
  );

  // const getVariant = () => {
  //   if (mode === 'preview' && splitTabs) return 'fullWidth';
  // };

  if (!entry) {
    return (
      <PageBox mode={mode} variant="default">
        Loading...
      </PageBox>
    );
  }

  return (
    <ShellContext.Provider value={shellContextValue}>
      <PageBox
        variant={
          !splitTabs
            ? soloSize
              ? 'blend'
              : 'default'
            : splitSize
              ? 'default'
              : 'blend'
        }
        tabType="glossary"
        mode={mode}
      >
        {mode === 'edit' && editComponent ? (
          React.createElement(editComponent, {
            ...editComponentProps,
          })
        ) : mode === 'preview' && previewComponent ? (
          React.createElement(previewComponent, {
            ...previewComponentProps,
          })
        ) : (
          <div style={{ padding: '16px' }}>Yo shit is busted, bruh</div>
        )}
      </PageBox>
    </ShellContext.Provider>
  );
};

export default CreateGlossaryShell;
