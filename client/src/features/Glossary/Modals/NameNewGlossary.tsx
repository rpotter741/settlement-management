import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { ulid as newId } from 'ulid';

import actions from '@/services/glossaryServices.js';
import glossaryThunks from '@/app/thunks/glossaryThunks.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import Editor from '@/components/shared/TipTap/Editor.js';
import GenreSelect from '@/components/shared/Metadata/GenreSelect.js';
import { Genre } from '../../../../../shared/types/index.ts';
import { invoke } from '@tauri-apps/api/core';
import { createGlossary } from '@/helpers/seedWorld.ts';
import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.ts';

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
          try {
            const glossary: GlossaryStateEntry = await createGlossary({
              id: newId(),
              name: glossaryName.trim(),
              genre,
              sub_genre: subGenre || '',
              description: descString,
              created_by: 'robbiepottsdm',
              content_type: 'SYSTEM',
            });
            closeModal();

            console.log('New Glossary Created:', glossary);

            dispatch(glossaryThunks.addAndActivateGlossary({ ...glossary }));
          } catch (error) {
            console.error('Error creating glossary:', error);
          }
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
