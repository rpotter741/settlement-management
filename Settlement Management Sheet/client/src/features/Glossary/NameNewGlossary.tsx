import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { v4 as newId } from 'uuid';

import actions from '../../services/glossaryServices.js';
import thunks from '../../app/thunks/glossaryThunks.js';

interface NameNewGlossaryProps {
  setModalContent: (content: React.ReactNode | null) => void;
  setGlossary: (name: string) => void;
}

const NameNewGlossary: React.FC<NameNewGlossaryProps> = ({
  setModalContent,
  setGlossary,
}) => {
  const [glossaryName, setGlossaryName] = useState('');
  const [description, setDescription] = useState('');

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
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        label="Description"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          // Handle the creation of the new glossary here
          const id = newId();
          const newGloss = await actions
            .createGlossary({
              id,
              name: glossaryName,
              description,
            })
            .then((response) => {
              console.log('Glossary created:', response.glossary);
              return response.glossary;
            });
          setModalContent(null);
          setGlossary(newGloss);
        }}
      >
        Create Glossary
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setModalContent(null)}
        style={{ marginLeft: '8px' }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default NameNewGlossary;
