import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ShellContext } from '@/context/ShellContext.js';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store.js';
import { Tab } from '@/app/types/SidePanelTypes.js';
import PageBox from '../Layout/PageBox.js';
import { selectActiveId } from '@/app/selectors/glossarySelectors.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';
import useNodeEditor from '@/hooks/useNodeEditor.js';
import { updateGlossaryEntry } from '@/app/slice/glossarySlice.js';
import EditFieldWithButton from '../Layout/EditFieldWithButton.js';
import { cloneDeep } from 'lodash';
import { useModalActions } from '@/hooks/useModal.js';
import { getGlossaryEntryById } from '@/app/thunks/glossaryThunks.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';

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
  pageVariant = 'default',
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { showModal, closeModal } = useModalActions();
  const { tool, id, mode, side, tabId, glossaryId, tabType } = tab;

  if (!glossaryId) return null;

  const {
    updateGlossaryEntry: update,
    node,
    entry,
    getLocalStorage,
    setLocalStorage,
    clearLocalStorage,
    localIsNewer,
  } = useNodeEditor(glossaryId, id);

  const { splitSize, soloSize, splitTabs } = useTabSplit();

  if (!entry) {
    return <PageBox variant="default">Loading...</PageBox>;
  }

  return (
    <ShellContext.Provider
      value={{
        tool,
        id,
        mode,
        side,
        tabId,
        glossaryId,
        update,
        entry,
        getLocalStorage,
        setLocalStorage,
        clearLocalStorage,
        localIsNewer,
        showModal,
        closeModal,
        node,
      }}
    >
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
