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

interface CreateGlossaryShellProps {
  tab: Tab;
  setModalContent: (content: {
    component: React.ComponentType;
    props?: Record<string, any>;
  }) => void;
  children: React.ReactNode;
}

const CreateGlossaryShell: React.FC<CreateGlossaryShellProps> = ({
  tab,
  setModalContent,
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { tool, id, mode, side, tabId, glossaryId } = tab;

  if (!glossaryId) return null;

  const {
    updateGlossaryEntry: update,
    node,
    entry,
  } = useNodeEditor(glossaryId, id);

  if (!entry?.name) {
    dispatch(
      getGlossaryNodeById({
        nodeId: id,
        glossaryId,
        entryType: node.entryType,
      })
    );
  }
  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});
  const [name, setName] = useState(node.name || '');
  const justUpdatedRef = useRef(false);

  useEffect(() => {
    if (entry.name !== node.name) {
      justUpdatedRef.current = true;
      update({ name });
      dispatch(updateTab({ tabId, side, keypath: 'name', updates: name }));
    }
  }, [name, dispatch, tabId, side]);

  // When node.name changes externally, sync state—but skip if we just updated it ourselves
  useEffect(() => {
    if (justUpdatedRef.current) {
      justUpdatedRef.current = false;
      return;
    }
    if (name !== node.name) {
      setName(node.name);
      dispatch(updateTab({ tabId, side, keypath: 'name', updates: node.name }));
    }
  }, [node.name]);

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  const syncLocalAndRemote = ({
    keypath,
    value,
  }: {
    keypath: string;
    value: any;
  }) => {
    // optimistic first, baby!
    update({ [keypath]: value });
    localStorage.setItem(
      id,
      JSON.stringify({
        ...cloneDeep(entry),
        lastSaved: new Date().toISOString(),
      })
    );
    setLastSaved((prev) => ({
      ...prev,
      [keypath]: new Date().toISOString(),
    }));
  };

  return (
    <ShellContext.Provider
      value={{
        tool,
        id,
        mode,
        side,
        lastSaved,
        setLastSaved,
        syncLocalAndRemote,
        setModalContent,
        entry,
      }}
    >
      <PageBox>
        <EditFieldWithButton
          label="Entry Title"
          value={name}
          onSave={handleNameChange}
          style={{
            marginBottom: 2,
            width: '100%',
            mt: 4,
          }}
        />
        {children}
      </PageBox>
    </ShellContext.Provider>
  );
};

export default CreateGlossaryShell;
