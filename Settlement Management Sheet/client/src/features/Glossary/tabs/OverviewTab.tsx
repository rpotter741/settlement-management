import {
  updateGlossaryEntry,
  updateGlossaryNode,
} from '@/app/slice/glossarySlice.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';
import { AppDispatch } from '@/app/store.js';
import thunks from '@/app/thunks/glossaryThunks.js';
import EditFieldWithButton from '@/components/shared/Layout/EditFieldWithButton.js';
import ShellEditor from '@/components/shared/TipTap/ShellEditor.js';
import { useShellContext } from '@/context/ShellContext.js';
import AttributeTagsTable from '@/features/Attributes/components/forms/TagTable.js';
import useNodeEditor from '@/hooks/glossary/useNodeEditor.js';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

const OverviewTab = () => {
  const { glossaryId, id, tabId, side, mode } = useShellContext();
  const {
    updateGlossaryEntry: update,
    node,
    entry,
  } = useNodeEditor(glossaryId, id);

  const dispatch: AppDispatch = useDispatch();

  const [name, setName] = useState(node.name || '');
  const justUpdatedRef = useRef(false);

  useEffect(() => {
    if (name !== node.name) {
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
    dispatch(updateTab({ tabId, side, keypath: 'name', updates: newName }));
    dispatch(
      thunks.renameNodeAndEntry({
        node,
      })
    );
  };

  return (
    <>
      <EditFieldWithButton
        label="Entry Title"
        value={name}
        onSave={handleNameChange}
        style={{
          width: '100%',
          mb: 2,
        }}
      />
      <ShellEditor keypath="description" maxHeight="500px" />
      <AttributeTagsTable />
    </>
  );
};

export default OverviewTab;
