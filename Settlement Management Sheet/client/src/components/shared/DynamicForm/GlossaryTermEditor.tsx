import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const GlossaryTermEditor = ({
  handleChange = (term: string) => {},
  defaultTerm = '',
  maxLength = 30,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [term, setTerm] = useState(defaultTerm || '');

  const handleCancel = () => {
    setIsEditing(false);
    setTerm(defaultTerm || '');
  };

  const handleSave = () => {
    handleChange(term);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TextField
        autoFocus
        value={term}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave();
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        }}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            setTerm(e.target.value);
          }
        }}
        onBlur={handleSave}
        variant="standard"
        fullWidth
      />
    );
  } else {
    return (
      <Button
        onClick={() => setIsEditing(true)}
        variant="text"
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          textTransform: 'none',
          color: 'text.primary',
          py: 1,
          cursor: 'pointer',
          textAlign: 'left',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            color: 'primary.main',
          },
        }}
      >
        <Typography variant="body1" sx={{ width: '100%', textAlign: 'left' }}>
          {term || 'Add Term'}
        </Typography>
      </Button>
    );
  }
};

export default GlossaryTermEditor;
