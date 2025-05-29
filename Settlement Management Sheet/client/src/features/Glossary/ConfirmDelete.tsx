import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface ConfirmDeleteProps {
  setModalContent: (content: React.ReactNode | null) => void;
  onDelete: () => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  setModalContent,
  onDelete,
}) => {
  return (
    <>
      <Typography variant="h6" color="error.main" gutterBottom>
        Confirm Deletion
      </Typography>
      <Typography variant="body1" gutterBottom>
        Are you sure you want to delete this item? If this is a folder,{' '}
        <strong>all of its contents will also be deleted.</strong>
      </Typography>
      <Typography variant="body1" color="error.main" gutterBottom>
        THIS ACTION CANNOT BE UNDONE.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setModalContent(null)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDelete();
            setModalContent(null);
          }}
        >
          Delete
        </Button>
      </Box>
    </>
  );
};

export default ConfirmDelete;
