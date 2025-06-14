import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/app/store.js';
import PageBox from '@/components/shared/Layout/PageBox.js';
import thunks from '@/app/thunks/glossaryThunks.js';
import {
  selectActiveId,
  selectGlossaryById,
  selectSnackbar,
} from '@/app/selectors/glossarySelectors.js';

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  ButtonGroup,
  Divider,
  Chip,
} from '@mui/material';
import { Delete, Public, Settings, Circle, Palette } from '@mui/icons-material';
import { isTabDirty } from '@/app/selectors/sidePanelSelectors.js';
import { setTabDirty } from '@/app/slice/sidePanelSlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { TitledCollapse } from '@/components/index.js';

const EditGlossary: React.FC = () => {
  const activeId = useSelector(selectActiveId());
  if (!activeId) return;
  const glossary = useSelector(selectGlossaryById(activeId));
  const dispatch: AppDispatch = useDispatch();

  const [name, setName] = useState(glossary?.name || '');
  const [description, setDescription] = useState(glossary?.description || '');

  const [isNameDirty, setIsNameDirty] = useState(false);
  const [isDescriptionDirty, setIsDescriptionDirty] = useState(false);

  const [paletteOpen, setPaletteOpen] = useState(false);

  const tabDirty = useSelector(isTabDirty(activeId));

  useEffect(() => {
    if ((isNameDirty || isDescriptionDirty) && !tabDirty) {
      dispatch(setTabDirty({ id: activeId, isDirty: true }));
    } else if (!isNameDirty && !isDescriptionDirty && tabDirty) {
      dispatch(setTabDirty({ id: activeId, isDirty: false }));
    }
  }, [isNameDirty, isDescriptionDirty, tabDirty, activeId, dispatch]);

  useEffect(() => {
    if (glossary.name !== name) {
      setIsNameDirty(true);
    } else {
      setIsNameDirty(false);
    }
  }, [glossary.name, name]);

  useEffect(() => {
    if (glossary.description !== description) {
      setIsDescriptionDirty(true);
    } else {
      setIsDescriptionDirty(false);
    }
  }, [glossary.description, description]);

  const handleSave = () => {
    try {
      dispatch(
        thunks.updateGlossaryThunk({
          id: glossary.id,
          name,
          description,
        })
      );
      setIsNameDirty(false);
      setIsDescriptionDirty(false);
      dispatch(setTabDirty({ id: activeId, isDirty: false }));
    } catch (error: any) {
      console.error('Error updating glossary:', error);
    }
  };

  return (
    <PageBox
      innerStyle={{
        border: '1px solid',
        borderColor: 'primary.main',
      }}
    >
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Configure {glossary.name}</Typography>
        <TextField
          label="Glossary Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <Circle
                  sx={{
                    color: !isNameDirty ? 'transparent' : 'error.main',
                    fontSize: '.75rem',
                  }}
                />
              ),
            },
          }}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={6}
          slotProps={{
            input: {
              endAdornment: (
                <Circle
                  sx={{
                    color: !isDescriptionDirty ? 'transparent' : 'error.main',
                    fontSize: '.75rem',
                  }}
                />
              ),
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            my: 2,
          }}
        >
          <Button
            disabled={!tabDirty}
            variant="contained"
            color={'success'}
            onClick={handleSave}
            sx={{ opacity: tabDirty ? 1 : 0 }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            disabled={!tabDirty}
            onClick={() => {
              setName(glossary.name);
              setDescription(glossary.description);
              setIsNameDirty(false);
              setIsDescriptionDirty(false);
              dispatch(setTabDirty({ id: activeId, isDirty: false }));
            }}
            sx={{ opacity: tabDirty ? 1 : 0 }}
          >
            Reset
          </Button>
        </Box>
        <Divider flexItem>
          <Chip
            label={<Typography variant="h6">Palette Settings</Typography>}
            icon={<Palette />}
          />
        </Divider>
      </Box>
    </PageBox>
  );
};

export default EditGlossary;
