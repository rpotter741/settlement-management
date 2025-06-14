import React, { useState, useEffect } from 'react';

import { Box, Typography, Button, Tooltip } from '@mui/material';

interface ConfirmDeleteProps {
  setModalContent: (content: React.ReactNode | null) => void;
  onDelete: () => void;
  name: string;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  setModalContent,
  onDelete,
  name = 'this entry',
}) => {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled(false);
    }, 1500); // Disable after 5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  });
  return (
    <>
      <Typography variant="h6" color="error.main" gutterBottom>
        Confirm Deletion
      </Typography>
      <Typography variant="body1" gutterBottom>
        Are you sure you want to delete {name}? If this is a{' '}
        <Tooltip
          title={
            <Typography>
              Continent / Nation / Region / Geography / Settlement / Faction
            </Typography>
          }
          arrow
          placement="top"
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 'bold',
              color: 'info.main',
              cursor: 'pointer',
            }}
          >
            section
          </Typography>
        </Tooltip>
        , <strong>all of its contents will also be deleted.</strong>
      </Typography>
      <Typography
        variant="body1"
        color="error.main"
        gutterBottom
        sx={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: 1 }}
      >
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
          disabled={disabled}
        >
          Delete
        </Button>
      </Box>
    </>
  );
};

export default ConfirmDelete;
