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
            keypath="continent"
            options={['Eldaja', 'Oderra', 'Nerath']}
            label="Continents"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="regions"
            options={['Marka', 'Dhacha', 'Xtera', 'Khal', 'Nivasa', 'Aymaq']}
            label="Regions"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={false}
            keypath="capital"
            options={[
              'Highburg',
              'Poria',
              'Qurg',
              'Umra',
              'Evergrove',
              'Locrat',
            ]}
            label="Capital City"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={false}
            keypath="population"
            options={[
              'Less than 10,000',
              '10,000 - 50,000',
              '50,000 - 100,000',
              '100,000 - 500,000',
              '500,000 - 1 million',
              '1 million - 5 million',
              '5 million - 10 million',
              'Over 10 million',
            ]}
            label="Population"
            alphabetizeOptions={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="languages"
            options={['Common', 'Elvish', 'Dwarvish', 'Draconic', 'Gnomish']}
            label="Languages Spoken"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="persons"
            options={['King', 'Queen', 'Chieftain', 'Elder', 'High Priest']}
            label="Notable Persons"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="eventLog"
            options={['Battle of Highburg', 'Founding of Poria', 'Great Flood']}
            label="Notable Events"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="locations"
            options={[
              'The Great Library',
              'The Crystal Caverns',
              'Grave of the First World',
            ]}
            label="Notable Locations"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlossaryAutocomplete
            multiple={true}
            keypath="geography"
            options={[
              'Rustwood',
              'Smokereach Caverns',
              'Faewood',
              "Alohma's Basin",
            ]}
            label="Nearby Geographic Features"
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

export default EditLandmarkForm;
