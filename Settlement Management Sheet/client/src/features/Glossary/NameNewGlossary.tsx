import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { v4 as newId } from 'uuid';

import actions from '../../services/glossaryServices.js';
import glossaryThunks from '../../app/thunks/glossaryThunks.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import Editor from '@/components/shared/TipTap/Editor.js';
import GenreSelect, {
  Genre,
} from '@/components/shared/Metadata/GenreSelect.js';

interface NameNewGlossaryProps {}

const NameNewGlossary: React.FC<NameNewGlossaryProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [glossaryName, setGlossaryName] = useState('');
  const [description, setDescription] = useState('');
  const [descString, setDescString] = useState('');
  const [genre, setGenre] = useState<Genre>('Fantasy');
  const [subGenre, setSubGenre] = useState('');
  const [jsonDesc, setJsonDesc] = useState('');
  const { closeModal } = useModalActions();

  const processEditor = (updates: Record<string, any>) => {
    setDescription(updates.description);
    setDescString(updates.dataString);
  };

  return (
    <Box sx={{ width: '50vw' }}>
      <TextField
        value={glossaryName}
        onChange={(e) => setGlossaryName(e.target.value)}
        label="Glossary Name"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <GenreSelect
        defaultGenre={genre}
        defaultSubGenre={subGenre}
        updateFn={(field, value) => {
          if (field === 'genre') {
            setGenre(value as Genre);
          } else if (field === 'subGenre') {
            setSubGenre(value);
          }
        }}
      />
      <Editor propUpdate={processEditor} html={description} />
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          // Handle the creation of the new glossary here
          const id = newId();
          const newGloss = await actions
            .createGlossary({
              id,
              name: glossaryName.trim(),
              description: {
                markdown: description,
                string: descString,
              },
              genre,
              subGenre,
            })
            .then((response) => {
              console.log('Glossary created:', response.glossary);
              return response.glossary;
            });
          closeModal();

          dispatch(glossaryThunks.addAndActivateGlossary({ ...newGloss }));
        }}
      >
        Create Glossary
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => closeModal()}
        style={{ marginLeft: '8px' }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default NameNewGlossary;
