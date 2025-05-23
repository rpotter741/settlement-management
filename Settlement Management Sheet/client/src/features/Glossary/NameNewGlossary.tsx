import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

import actions from './helpers/glossaryActions.js';

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
          const newGloss = await actions
            .createGlossary({
              name: glossaryName,
              description,
            })
            .then((response) => {
              return response.data;
            });
          setModalContent(null);
          setGlossary(newGloss.name);
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
