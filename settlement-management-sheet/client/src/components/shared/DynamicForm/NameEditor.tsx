import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const NameEditor = ({
  defaultValue,
  handleSave,
  fontSize = '1.2rem',
  label,
}: {
  defaultValue: string;
  handleSave: (newValue: string) => void;
  fontSize?: string;
  label?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: 1,
        borderColor: isEditing ? 'primary.main' : 'divider',
        p: 1,
        borderRadius: 1,
        width: '100%',
        justifyContent: 'start',
        maxWidth: 350,
        position: 'relative',
        height: 55,
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {label && (
        <Typography
          sx={{
            fontSize: '1rem',
            position: 'absolute',
            top: -10,
            left: 10,
            bgcolor: 'background.paper',
            px: 0.5,
          }}
        >
          {label}
        </Typography>
      )}
      {isEditing ? (
        <TextField
          variant="standard"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ flex: 1, px: 2, maxWidth: 300 }}
          size="medium"
          slotProps={{
            input: {
              disableUnderline: true,
              style: { fontSize },
            },
          }}
          autoFocus
        />
      ) : (
        <Typography sx={{ fontSize, maxWidth: 300, ml: 2 }}>{value}</Typography>
      )}
      {(isEditing || isHover) && (
        <Button
          color="secondary"
          onClick={() => {
            if (isEditing) {
              handleSave(value);
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
          sx={{ position: 'absolute', right: 0 }}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      )}
    </Box>
  );
};

export default NameEditor;
