import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { v4 as newId } from 'uuid';

import actions from '../../services/glossaryServices.js';
import thunks, {
  addAndActivateGlossary,
} from '../../app/thunks/glossaryThunks.js';
import { useModalActions } from '@/hooks/useModal.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import {
  initializeGlossary,
  setActiveGlossaryId,
} from '@/app/slice/glossarySlice.js';
import { initial } from 'lodash';
import Editor from '@/components/shared/TipTap/Editor.js';

interface NameNewGlossaryProps {}

const NameNewGlossary: React.FC<NameNewGlossaryProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [glossaryName, setGlossaryName] = useState('');
  const [description, setDescription] = useState('');
  const [jsonDesc, setJsonDesc] = useState('');
  const { closeModal } = useModalActions();

  const processEditor = (updates: Record<string, any>) => {
    setDescription(updates.description);
  };

  return (
    <Box>
      <TextField
        value={glossaryName}
        onChange={(e) => setGlossaryName(e.target.value)}
        label="Glossary Name"
        variant="outlined"
        fullWidth
        margin="normal"
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
              description,
            })
            .then((response) => {
              console.log('Glossary created:', response.glossary);
              return response.glossary;
            });
          closeModal();
          dispatch(addAndActivateGlossary({ ...newGloss }));
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
