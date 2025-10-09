import { selectEditGlossaryById } from '@/app/selectors/glossarySelectors.js';
import { AppDispatch } from '@/app/store.js';
import { Tab } from '@/app/types/TabTypes.js';
import { Box } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import TermRowAndSettings from '../../forms/TermRowAndSetting.js';
import { useState } from 'react';
import { updateTab } from '@/app/slice/tabSlice.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';
import { Typography } from '@mui/material';
import { useAutosave } from '@/hooks/utility/useAutosave/useAutosave.js';
import glossaryTermAutosaveConfig from '@/hooks/utility/useAutosave/configs/glossaryTermConfig.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { updateUIKey } from '@/app/slice/uiSlice.js';
import GlossaryMainWrapper from '../components/GlossaryMainWrapper.js';

export const termRenderOrder = [
  'system',
  'geography',
  'politics',
  'relationships',
  'history',
  'custom',
];

const GlossaryTermsEditor = () => {
  const { glossary, ui, updateUI } = useGlossaryEditor();

  useAutosave(
    glossaryTermAutosaveConfig({
      id: glossary.id,
      genre: glossary.genre,
      name: glossary.name,
    })
  );

  const [activeIndex, setActiveIndex] = useState<number>(
    ui.activeTermIndex || -1
  );

  const handleEditClick = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
    updateUI({
      key: 'activeTermIndex',
      value: activeIndex === index ? -1 : index,
    });
  };

  const duration = 0.33;

  if (!glossary) return null;

  return (
    <GlossaryMainWrapper>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          width: '100%',
          overflowY: 'scroll',
          overflowX: 'hidden',
          p: [1, 2, 4, 8, 10],
          mx: 'auto',
          maxWidth: '960px',
        }}
      >
        <AnimatePresence initial={false}>
          <MotionBox
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ scale: 0.5, opacity: 0, y: 20 }}
            transition={{ duration, ease: 'easeInOut' }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              px: 2,
              mb: 2,
            }}
          >
            <Typography>
              Glossary Terms allows you to manage the terms used in the UI to
              make your world-building experience more immersive.
            </Typography>
            <Typography>
              Clicking in the <strong>Custom Name</strong> field allows you to
              edit the term directly. Clicking on the{' '}
              <strong>Edit Button</strong> will open up more configuration
              options for that type of object, based on the System Name.
            </Typography>
          </MotionBox>
          {termRenderOrder.map((type, index) => {
            if (activeIndex === -1 || activeIndex === index)
              return (
                <TermRowAndSettings
                  key={type}
                  index={index}
                  activeIndex={activeIndex}
                  setEditing={handleEditClick}
                  entryType={type}
                  glossary={glossary}
                  duration={duration}
                />
              );
          })}
        </AnimatePresence>
      </Box>
    </GlossaryMainWrapper>
  );
};

export default GlossaryTermsEditor;
