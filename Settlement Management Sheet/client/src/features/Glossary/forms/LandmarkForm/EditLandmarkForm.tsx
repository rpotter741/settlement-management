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

interface EditLandmarkFormProps {}

const EditLandmarkForm: React.FC<EditLandmarkFormProps> = ({}) => {
  const { glossaryId, id, tabId, side } = useShellContext();
  const {
    updateGlossaryEntry: update,
    node,
    entry,
  } = useNodeEditor(glossaryId, id);

  const dispatch: AppDispatch = useDispatch();

  if (!entry?.name) {
    dispatch(
      getGlossaryEntryById({
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

  const splitTabs = useSelector(isSplit);
  const breakpoint = useMediaQuery('(min-width: 900px)');
  const either = splitTabs || !breakpoint;
  const both = splitTabs && breakpoint;

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        height: '100%',
        py: 0.5,
        px: both ? 1 : either ? 2 : 4,
        mt: 4,
        gap: both ? 0 : either ? 2 : 4,
        // width: both ? '100%' : either ? '80%' : '80%',
      }}
    >
      <Box sx={{ height: '100%' }}>
        <EditFieldWithButton
          label="Entry Title"
          value={name}
          onSave={handleNameChange}
          style={{
            marginBottom: 2,
            width: '100%',
          }}
        />
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}></Grid>
        </Grid>
        <ShellEditor
          keypath="description"
          lastSaved={lastSaved?.description || null}
          setLastSaved={setLastSaved}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <GlossaryAutocomplete
          multiple={false}
          keypath="climate"
          options={ClimateTypeOptions}
          label="Climate"
        />
        <GlossaryAutocomplete
          multiple={true}
          keypath="region"
          options={['Marka', 'Dhacha', 'Xtera', 'Khal', 'Nivasa', 'Aymaq']}
          label="Region"
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
