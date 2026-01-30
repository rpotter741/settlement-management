import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, IconButton } from '@mui/material';
import { Circle } from '@mui/icons-material';

interface EditFieldWithButtonProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  style?: any;
}

const EditFieldWithButton: React.FC<EditFieldWithButtonProps> = ({
  label,
  value,
  onSave,
  style = {},
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [editing, setEditing] = useState<Boolean>(false);
  const isDirty = inputValue !== value;

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(inputValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ...style }}>
      <TextField
        label={label}
        variant="outlined"
        value={inputValue}
        onChange={handleChange}
        disabled={!editing}
        fullWidth
        slotProps={{
          input: {
            endAdornment: editing ? (
              <Circle
                sx={{
                  color: !isDirty ? 'transparent' : 'error.main',
                  fontSize: '.75rem',
                }}
              />
            ) : null,
          },
        }}
      />
      <Button
        variant="contained"
        onClick={() => {
          if (editing) {
            handleSave();
          }
          setEditing(!editing);
          if (editing && isDirty) {
            setInputValue(value); // Reset to original value if saving
          }
        }}
      >
        {editing ? 'Save' : 'Edit'}
      </Button>
      <Button
        variant="outlined"
        disabled={!editing}
        onClick={() => {
          setInputValue(value); // Reset to original value
          setEditing(false);
        }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default EditFieldWithButton;
