import { Check, Close, Edit } from '@mui/icons-material';
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
import useTheming from '@/hooks/layout/useTheming.js';

const TermEditor = ({
  handleChange = (term: string | null) => {},
  defaultTerm = '',
  maxLength = 30,
  fallback = 'noFallbackProvided',
  width = '100%',
}) => {
  const { getAlphaColor } = useTheming();
  const [isEditing, setIsEditing] = useState(false);
  const [term, setTerm] = useState(defaultTerm || '');

  const [showCheck, setShowCheck] = useState(false);
  const [showRowContent, setShowRowContent] = useState(false);
  const [wasReset, setWasReset] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
    setTerm(defaultTerm || '');
  };

  const handleSave = () => {
    if (term.trim() !== '') {
      handleChange(term);
    } else {
      handleChange(fallback);
      setTerm(fallback);
    }
    setIsEditing(false);
    setShowCheck(true);
  };

  const handleReset = () => {
    setWasReset(true);
    setShowCheck(true);
    handleChange(null);
    setTerm(fallback);
    setTimeout(() => {
      setWasReset(false);
      setShowCheck(false);
    }, 1000);
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
          sx={{ flex: 1, height: 46, width }}
        />
      ) : (
        <RowMotionBox
          className={wasReset ? 'invalid-shake' : ''}
          initial={{
            x: -20,
            opacity: 0,
            height: 46,
          }}
          animate={{
            x: 0,
            opacity: 1,
            height: 46,
          }}
          exit={{ x: 20, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.33, ease: 'easeOut' }}
          onAnimationComplete={() => {
            setTimeout(() => {
              setShowCheck(false);
            }, 1000);
          }}
          sx={{
            width,
            display: 'flex',
            flex: 1,
            position: 'relative',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textTransform: 'none',
            color: 'text.primary',
            borderRadius: 2,
            boxSizing: 'border-box',
            py: 1,
            gap: 1,
          }}
          onMouseEnter={() => setShowRowContent(true)}
          onMouseLeave={() => setShowRowContent(false)}
          onFocus={() => setShowRowContent(true)}
          onBlur={() => setShowRowContent(false)}
        >
          <Button
            onClick={() => setIsEditing(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              gap: 1,
              width: '100%',
              color: 'inherit',
              textTransform: 'none',
              px: 0,
              border: '1px solid',
              borderColor: (theme) =>
                wasReset
                  ? getAlphaColor({
                      color: 'info',
                      key: 'main',
                      opacity: 0.4,
                    })
                  : showCheck
                    ? alpha(theme.palette.success.main, 0.55)
                    : 'transparent',
            }}
          >
            <Box>
              <IconButton>
                {showCheck ? (
                  <Check sx={{ fontSize: '1rem', color: 'success.main' }} />
                ) : !showCheck && showRowContent ? (
                  <Edit sx={{ fontSize: '1rem' }} />
                ) : (
                  <Edit sx={{ fontSize: '1rem', color: 'transparent' }} />
                )}
              </IconButton>
            </Box>
            <Typography
              variant="body1"
              sx={{
                width: '75%',
                textAlign: 'left',
                fontStyle: term.trim() === '' ? 'italic' : 'normal',
              }}
            >
              {term || fallback || 'Add Term'}
            </Typography>
          </Button>

          {showRowContent &&
            term !== fallback &&
            fallback !== 'noFallbackProvided' && (
              <IconButton
                color="warning"
                sx={{ position: 'absolute', right: 8 }}
                onClick={handleReset}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
        </RowMotionBox>
      )}
    </AnimatePresence>
  );
};

export default TermEditor;
