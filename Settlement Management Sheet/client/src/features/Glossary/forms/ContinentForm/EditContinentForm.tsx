import { Grid2 as Grid } from '@mui/material';
import GlossaryAutocomplete from '@/components/shared/DynamicForm/GlossaryAutocomplete.js';

import {
  ClimateTypeOptions,
  geographicEntryTypeOptions as geographyTypeOptions,
  TerrainTypeOptions,
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
import { Box } from '@mui/system';

interface EditContinentFormProps {}

const EditContinentForm: React.FC<EditContinentFormProps> = ({}) => {
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

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  return (
    <>
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
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="nations"
            options={[
              'Vescania',
              'Astagua',
              'Kotorum',
              'Locrati',
              'Jaswa',
              'Oscad',
            ]}
            label="Nations"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="regions"
            options={['Region a', 'Region b', 'Region c']}
            label="Regions"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="locations"
            options={['Location A', 'Location B', 'Location C']}
            label="Locations"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="resources"
            options={['Food', 'Medical Capacity', 'Defensive Infrastructure']}
            label="Resources"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={false}
            keypath="population"
            options={[
              'Uninhabited',
              '< 5,000',
              '5,000 - 25,000',
              '25,000 - 100,000',
              '> 100,000',
            ]}
            label="Population"
            alphabetizeOptions={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="climate"
            options={ClimateTypeOptions}
            label="Climate Types"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="terrain"
            options={TerrainTypeOptions}
            label="Terrain Types"
          />
        </Grid>
      </Grid>
      <ShellEditor
        keypath="description"
        lastSaved={lastSaved?.description || null}
        setLastSaved={setLastSaved}
      />
    </>
  );
};

export default EditContinentForm;
