import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const UndoToast = ({ message, onUndo }) => (
  <Box>
    <Typography>{message}</Typography>
    <Button color="secondary" onClick={onUndo} size="small">
      Undo
    </Button>
  </Box>
);

export default UndoToast;
