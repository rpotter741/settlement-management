import { Check, Edit } from '@mui/icons-material';
import {
  alpha,
  Button,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Box, useTheme } from '@mui/system';
import { useState } from 'react';
import { RowMotionBox } from '../Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';
import getRippleBorder from '@/utility/style/getRippleBorder.js';
import BorderWrapper from '../Layout/Motion/BorderWrapper.js';

const GlossaryTermEditor = ({
  handleChange = (term: string) => {},
  defaultTerm = '',
  maxLength = 30,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [term, setTerm] = useState(defaultTerm || '');

  const [showCheck, setShowCheck] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
    setTerm(defaultTerm || '');
  };

  const handleSave = () => {
    handleChange(term);
    setIsEditing(false);
    setShowCheck(true);
  };

  return (
    <AnimatePresence>
      {isEditing ? (
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
      ) : (
        <RowMotionBox
          initial={{
            x: -20,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{ x: 20, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.33, ease: 'easeOut' }}
          onAnimationComplete={() => {
            setTimeout(() => {
              setShowCheck(false);
            }, 1000);
          }}
          sx={(theme) => ({
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textTransform: 'none',
            color: 'text.primary',
            borderRadius: 2,
            boxSizing: 'border-box',
            py: 1,
            gap: 1,
            border: '1px solid',
            borderColor: (theme) =>
              showCheck
                ? alpha(theme.palette.success.main, 0.55)
                : 'transparent',
            transition: 'border-color 0.3s ease-in-out',
          })}
        >
          <IconButton
            onClick={() => setIsEditing(true)}
            sx={{
              cursor: 'pointer',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: 'primary.main',
              },
            }}
          >
            {showCheck ? (
              <Check sx={{ fontSize: '1rem', color: 'success.main' }} />
            ) : (
              <Edit sx={{ fontSize: '1rem' }} />
            )}
          </IconButton>

          <Typography
            variant="body1"
            sx={{
              width: '25%',
              textAlign: 'left',
            }}
          >
            {term || 'Add Term'}
          </Typography>
        </RowMotionBox>
      )}
    </AnimatePresence>
  );
};

export default GlossaryTermEditor;
