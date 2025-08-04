import React from 'react';
import MotionBox, {
  RowMotionBox,
} from '@/components/shared/Layout/Motion/MotionBox.js';
import { Button, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { AnimatePresence } from 'framer-motion';
import { capitalize } from 'lodash';
import { Suspense, useEffect, useState } from 'react';
import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';
import GlossaryPropertyLabels from '../utils/propertyMaps/GlossaryPropertyLabels.js';
import { isEven } from '@/utility/booleans/numberTests.js';
import useTheming from '@/hooks/layout/useTheming.js';
import getPropertyLabel, {
  SubSectionTypes,
} from '../utils/getPropertyLabel.js';
import { Tab } from '@/app/types/TabTypes.js';

interface TermRowAndSettingsProps {
  tab: Tab;
  index: number;
  activeIndex: number;
  setEditing: (index: number) => void;
  entryType: string;
  glossary: GlossaryStateEntry;
  duration?: number;
}

const TermRowAndSettings: React.FC<TermRowAndSettingsProps> = ({
  tab,
  index,
  activeIndex,
  setEditing,
  entryType,
  glossary,
  duration = 0.4,
}) => {
  const { darkenColor, getHexValue } = useTheming();
  const [isEditing, setIsEditing] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleClick = () => {
    if (isEditing) {
      setIsEditing(false);
      const timer = setTimeout(() => {
        setEditing(index);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setEditing(index);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (animationComplete && activeIndex === index) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }

    timer = setTimeout(() => {
      if (activeIndex === index && !isEditing) {
        setIsEditing(true);
      } else {
        if (activeIndex !== index) {
          setIsEditing(false);
        }
      }
    }, duration * 1000);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [animationComplete, activeIndex, index]);

  const evenRow = isEven(index);

  const Component = GlossaryPropertyLabels;

  return (
    <MotionBox
      key={index}
      layout
      layoutId={`term-row-${index}`}
      initial={{ height: 0, opacity: 0, paddingBottom: 0 }}
      animate={{
        height: index === activeIndex ? 'auto' : 54,
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
          setAnimationComplete(true);
        }
      }}
    >
      <RowMotionBox
        animate={{
          backgroundColor:
            activeIndex === index
              ? getHexValue({ color: 'secondary', key: 'dark' })
              : !evenRow
                ? getHexValue({ color: 'background', key: 'default' })
                : darkenColor({
                    color: 'background',
                    key: 'default',
                    amount: 0.05,
                  }),
          border: index === activeIndex ? '1px solid' : 'none',
          borderColor:
            index === activeIndex
              ? getHexValue({ color: 'primary', key: 'contrastText' })
              : '#fff',
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 3,
          minHeight: '54px',
        }}
      >
        <Box
          sx={{
            width: '80%',
            color:
              activeIndex === index ? 'primary.contrastText' : 'text.primary',
            transition: 'width 0.4s ease, color 0.3s ease',
            textAlign: 'left',
            pl: 2,
            gap: 2,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {entryType === 'System' ? (
            <Typography variant="h6">System</Typography>
          ) : (
            <>
              <Typography variant="h6">
                {getPropertyLabel({
                  glossary,
                  section: entryType.toLowerCase() as SubSectionTypes,
                  key: `${entryType} Name`,
                })}
              </Typography>
              {entryType !==
                getPropertyLabel({
                  glossary,
                  section: entryType.toLowerCase() as SubSectionTypes,
                  key: `${entryType} Name`,
                }) && <Typography>{` (${capitalize(entryType)})`}</Typography>}
            </>
          )}
        </Box>

        <Box sx={{ width: '20%' }}>
          <Button variant="contained" onClick={handleClick} color="primary">
            {activeIndex === index ? 'Done' : 'Edit'}
          </Button>
        </Box>
      </RowMotionBox>
      <AnimatePresence mode="wait" initial={false}>
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
              {React.createElement(Component, {
                glossary,
                entryType: entryType.toLowerCase() as SubSectionTypes,
                tab,
              })}
            </Suspense>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default TermRowAndSettings;
