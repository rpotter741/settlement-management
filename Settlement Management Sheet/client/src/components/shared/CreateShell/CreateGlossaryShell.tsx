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
import { getGlossaryNodeById } from '@/app/thunks/glossaryThunks.js';
import { useModalActions } from '@/hooks/useModal.js';

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
  } = useNodeEditor(glossaryId, id);

  // const syncLocalAndRemote = ({
  //   keypath,
  //   value,
  // }: {
  //   keypath: string;
  //   value: any;
  // }) => {
  //   // optimistic first, baby!
  //   update({ [keypath]: value });
  //   localStorage.setItem(
  //     id,
  //     JSON.stringify({
  //       ...cloneDeep(entry),
  //       lastSaved: new Date().toISOString(),
  //     })
  //   );
  //   setLastSaved((prev) => ({
  //     ...prev,
  //     [keypath]: new Date().toISOString(),
  //   }));
  // };

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
        showModal,
        closeModal,
        node,
      }}
    >
      <PageBox
        variant={
          pageVariant ? pageVariant : mode === 'edit' ? 'default' : 'fullWidth'
        }
      >
        {mode === 'edit' && editComponent ? (
          React.createElement(editComponent, {
            ...editComponentProps,
            update,
            entry,
            node,
            tab,
          })
        ) : mode === 'preview' && previewComponent ? (
          React.createElement(previewComponent, {
            ...previewComponentProps,
            entry,
            tab,
          })
        ) : (
          <div style={{ padding: '16px' }}>Yo shit is busted, bruh</div>
        )}
      </PageBox>
    </ShellContext.Provider>
  );
};

export default CreateGlossaryShell;
