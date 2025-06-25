import { Grid2 as Grid } from '@mui/material';
import GlossaryAutocomplete from '@/components/shared/DynamicForm/GlossaryAutocomplete.js';

import {
  ClimateTypeOptions,
  geographicEntryTypeOptions as geographyTypeOptions,
} from 'types/index.js';
import React, { useEffect, useRef, useState } from 'react';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import EditFieldWithButton from '@/components/shared/Layout/EditFieldWithButton.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/useNodeEditor.js';
import { getGlossaryEntryById } from '@/app/thunks/glossaryThunks.js';
import ShellEditor from '@/components/shared/TipTap/ShellEditor.js';
import { Box, useMediaQuery } from '@mui/system';
import { useSelector } from 'react-redux';
import { isSplit } from '@/app/selectors/sidePanelSelectors.js';
import GlossaryPropEditor from '@/components/shared/Layout/GlossaryPropEditor.js';
import useTabSplit from '@/hooks/layout/useTabSplit.js';
import propertyArrayMap from '../../helpers/entryTypePropertyArray.js';

interface EditLandmarkFormProps {
  height: string;
}

const EditLandmarkForm: React.FC<EditLandmarkFormProps> = ({
  height = '100%',
}) => {
  const { glossaryId, id, tabId, side, mode } = useShellContext();
  const {
    updateGlossaryEntry: update,
    node,
    entry,
  } = useNodeEditor(glossaryId, id);

  console.log(height);

  const dispatch: AppDispatch = useDispatch();

  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});
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

  const { either, both } = useTabSplit();

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height,
        py: 4,
        px: both ? 1 : either ? 0 : 2,
        mt: 2,
        alignContent: 'start',
        gap: 2,
        borderRadius: mode === 'edit' ? 2 : 0,
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        overflowY: 'scroll',
      }}
    >
      <EditFieldWithButton
        label="Entry Title"
        value={name}
        onSave={handleNameChange}
        style={{
          width: '100%',
        }}
      />
      <Box
        sx={{ flex: '2 0 0', boxSizing: 'border-box' }}
        className="shell-editor-container"
      >
        <ShellEditor
          keypath="description"
          lastSaved={lastSaved?.description || null}
          setLastSaved={setLastSaved}
        />
      </Box>
      <Box
        sx={{
          flex: '1 0 0',
          px: 1,
          boxSizing: 'border-box',
          backgroundColor: 'background.default',
          py: 2,
          borderRadius: 2,
        }}
      >
        <GlossaryAutocomplete
          multiple={false}
          keypath="climates"
          options={ClimateTypeOptions}
          label="Climate"
        />
        <GlossaryPropEditor
          multiple={true}
          keypath="regions"
          options={['Marka', 'Dhacha', 'Xtera', 'Khal', 'Nivasa', 'Aymaq']}
          label="Region"
          hasPrimary={true}
        />
        <GlossaryAutocomplete
          multiple={false}
          keypath="type"
          options={geographyTypeOptions}
          label="Type"
        />
      </Box>
    </Box>
  );
};

export default EditLandmarkForm;
