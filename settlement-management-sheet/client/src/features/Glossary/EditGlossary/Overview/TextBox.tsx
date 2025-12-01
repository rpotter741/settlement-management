import { useState } from 'react';
import MotionBox, {
  RowMotionBox,
} from '@/components/shared/Layout/Motion/MotionBox.js';
import { Button, TextField, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { Check, Edit } from '@mui/icons-material';
import useTheming from '@/hooks/layout/useTheming.js';

interface TextBoxProps {
  text: string;
  onChange: (newText: string) => void;
  variant?: 'body1' | 'h6' | 'subtitle1' | 'h4';
  fontSize?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  text,
  onChange,
  variant,
  fontSize,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text || '');

  const [showCheck, setShowCheck] = useState(false);
  const [showRowContent, setShowRowContent] = useState(false);

  const { getAlphaColor } = useTheming();

  const handleCancel = () => {
    setIsEditing(false);
    setNewText(text || '');
  };

  const handleSave = () => {
    if (newText.trim() !== '') {
      onChange(newText);
    } else {
      onChange(text);
      setNewText(text || '');
    }
    setIsEditing(false);
    setShowCheck(true);
  };

  return (
    <AnimatePresence mode="popLayout">
      {isEditing ? (
        <MotionBox
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.33 }}
          key="text-box"
          layout
          layoutId="text-box"
          onClick={() => setIsEditing(false)}
        >
          <TextField
            autoFocus
            value={newText}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            onChange={(e) => setNewText(e.target.value)}
            onBlur={() => handleSave()}
            fullWidth
            variant="standard"
            color="info"
            slotProps={{
              input: {
                style: {
                  fontSize: fontSize || '1rem',
                  fontWeight: 500,
                  height: 52.4,
                },
              },
            }}
          />
        </MotionBox>
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
          sx={{
            width: '100%',
            display: 'flex',
            position: 'relative',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textTransform: 'none',
            color: 'text.primary',
            borderRadius: 8,

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
              justifyContent: 'flex-start',
              gap: 1,
              width: '100%',
              color: 'inherit',
              textTransform: 'none',
              border: '.1px solid',
              borderRadius: 8,
              borderColor: (theme) =>
                showCheck
                  ? getAlphaColor({
                      color: 'success',
                      key: 'main',
                      opacity: 0.55,
                    })
                  : 'divider',
            }}
          >
            {showCheck ? (
              <Check sx={{ fontSize: '1rem', color: 'success.main' }} />
            ) : !showCheck && showRowContent ? (
              <Edit sx={{ fontSize: '1rem' }} />
            ) : (
              <Edit sx={{ fontSize: '1rem', color: 'transparent' }} />
            )}

            <Typography
              variant={variant}
              sx={{
                width: '50%',
                textAlign: 'left',
                fontStyle: text.trim() === '' ? 'italic' : 'normal',
                fontSize: fontSize || '1rem',
              }}
            >
              {text}
            </Typography>
          </Button>
        </RowMotionBox>
      )}
    </AnimatePresence>
  );
};

export default TextBox;
