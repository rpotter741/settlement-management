import React, { useState, useEffect } from 'react';

import { Box, Typography, Button, Tooltip, TextField } from '@mui/material';
import { useModalActions } from '@/hooks/global/useModal.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import glossaryThunks from '@/app/thunks/glossaryThunks.js';
import { removeTab } from '@/app/slice/tabSlice.js';
import { Tab } from '@/app/types/TabTypes.js';
import {
  removeGlossary,
  setActiveGlossaryId,
} from '@/app/slice/glossarySlice.js';

interface ConfirmDeleteGlossaryProps {
  glossary: {
    name: string;
    id: string;
    description: string;
  };
  tab: Tab;
}

const ConfirmDeleteGlossary: React.FC<ConfirmDeleteGlossaryProps> = ({
  glossary,
  tab,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { closeModal } = useModalActions();
  const [disabled, setDisabled] = useState(true);
  const [confirm, setConfirm] = useState<string>('');

  const onDelete = () => {
    dispatch(
      glossaryThunks.deleteGlossary({ glossaryId: glossary.id, side: tab.side })
    );
  };

  const setTimer = () => {
    const timer = setTimeout(() => {
      setDisabled(false);
    }, 1500); // Disable after 1.5 seconds
  };

  return (
    <>
      <Typography variant="h6" color="error.main" gutterBottom>
        Confirm Deletion
      </Typography>
      <Typography variant="body1" gutterBottom>
        Are you sure you want to delete this glossary?{' '}
        <strong>all of its contents will also be deleted.</strong>
      </Typography>
      <Typography
        variant="body1"
        color="error.main"
        gutterBottom
        sx={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: 1 }}
      >
        THIS ACTION CANNOT BE UNDONE.
      </Typography>
      <Typography variant="body1" gutterBottom>
        To confirm, type the name of the glossary:{' '}
        <strong>{glossary.name}</strong>
      </Typography>
      <TextField
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        label="Type glossary name to confirm"
        variant="outlined"
        fullWidth
        margin="normal"
        autoFocus
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" color="primary" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDelete();
            closeModal();
          }}
          disabled={confirm !== glossary.name && disabled}
        >
          Delete
        </Button>
      </Box>
    </>
  );
};

export default ConfirmDeleteGlossary;
