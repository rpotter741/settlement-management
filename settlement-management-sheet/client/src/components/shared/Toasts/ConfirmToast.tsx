import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ConfirmToast = ({ message, onConfirm, onCancel }) => (
  <Box>
    <Typography>{message}</Typography>
    <Button color="primary" onClick={onConfirm} size="small">
      Confirm
    </Button>
    <Button color="error" onClick={onCancel} size="small">
      Cancel
    </Button>
  </Box>
);

export default ConfirmToast;
