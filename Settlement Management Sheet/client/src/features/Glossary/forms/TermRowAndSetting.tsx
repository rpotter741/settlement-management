import GlossaryTermEditor from '@/components/shared/DynamicForm/GlossaryTermEditor.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { Button, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { AnimatePresence } from 'framer-motion';
import { capitalize } from 'lodash';
import getTerm from '../utils/getTerm.js';
import { Suspense, useState } from 'react';
import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';
import GlossaryPropertyLabels from '../utils/propertyMaps/GlossaryPropertyLabels.js';
import { isEven } from '@/utility/booleans/numberTests.js';
import useTheming from '@/hooks/layout/useTheming.js';

interface TermRowAndSettingsProps {
  index: number;
  activeIndex: number;
  setEditing: (index: number) => void;
  handleTermChange: (key: string, newTerm: string) => void;
  entryType: string;
  fallbacks: Record<string, string>;
  glossary: GlossaryStateEntry;
  duration?: number;
}

const TermRowAndSettings: React.FC<TermRowAndSettingsProps> = ({
  index,
  activeIndex,
  setEditing,
  handleTermChange,
  entryType,
  fallbacks,
  glossary,
  duration = 0.4,
}) => {
  const { darkenColor } = useTheming();
  const isOpen = activeIndex === index || activeIndex === -1;
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    if (isEditing) {
      setIsEditing(false);
      const timer = setTimeout(() => {
        setEditing(-1);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setEditing(index);
    }
  };

  const evenRow = isEven(index);

  return (
    <MotionBox
      key={index}
      layout
      layoutId={`term-row-${index}`}
      initial={{ height: 0, opacity: 0, paddingBottom: 0 }}
      animate={{
        height: 'auto',
        opacity: 1,
        paddingBottom: 1,
      }}
      exit={{ height: 0, opacity: 0, paddingBottom: 0 }}
      transition={{ duration, ease: 'easeInOut' }}
      sx={{
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
      }}
      onLayoutAnimationComplete={() => {
        if (index === activeIndex && !isEditing) {
          setIsEditing(true);
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 3,
          minHeight: '54px',
          backgroundColor: evenRow
            ? 'background.default'
            : darkenColor({
                color: 'background',
                key: 'default',
                amount: 0.05,
              }),
        }}
      >
        <Typography
          variant={index === 0 ? 'h6' : 'body1'}
          sx={{
            width: activeIndex === index ? '0%' : '40%',
            color: activeIndex === index ? 'transparent' : 'text.primary',
            transition: 'width 0.4s ease, color 0.3s ease',
            textAlign: 'left',
          }}
        >
          {capitalize(entryType)}
        </Typography>
        <Box
          sx={{
            width: activeIndex === index ? '100%' : '40%',
            transition: 'width 0.4s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {index === 0 ? (
            <Typography
              variant={index === 0 ? 'h6' : 'body1'}
              sx={{ width: '100%', textAlign: 'left' }}
            >
              {fallbacks[entryType]}
            </Typography>
          ) : (
            <GlossaryTermEditor
              handleChange={(newTerm) => {
                handleTermChange(entryType, newTerm);
              }}
              defaultTerm={getTerm({
                glossary,
                key: entryType,
              })}
            />
          )}
        </Box>
        {index > 0 ? (
          <Box sx={{ width: '20%' }}>
            <Button variant="outlined" onClick={handleClick}>
              {activeIndex === index ? 'Done' : 'Edit'}
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: '20%' }} />
        )}
      </Box>
      <AnimatePresence mode="sync">
        {isEditing && (
          <MotionBox
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration, ease: 'easeInOut' }}
            sx={{
              width: '100%',
            }}
          >
            <Suspense
              fallback={<Skeleton variant="text" width="100%" height={50} />}
            >
              <GlossaryPropertyLabels glossary={glossary} />
            </Suspense>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default TermRowAndSettings;
