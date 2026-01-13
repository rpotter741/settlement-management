import { Box } from '@mui/system';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';
import { Typography } from '@mui/material';
import { useAutosave } from '@/hooks/utility/useAutosave/useAutosave.js';
import glossaryTermAutosaveConfig from '@/hooks/utility/useAutosave/configs/glossaryTermConfig.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import GlossaryMainWrapper from '../components/GlossaryMainWrapper.js';
import GlossaryPropertyLabels from '../components/GlossaryPropertyLabels.js';

export const termRenderOrder = ['system'];

const GlossaryTermsEditor = () => {
  const { glossary } = useGlossaryEditor();

  useAutosave(
    glossaryTermAutosaveConfig({
      id: glossary?.id,
      genre: glossary?.genre,
      name: glossary?.name,
    })
  );

  const duration = 0.33;

  if (!glossary) return null;

  return (
    <GlossaryMainWrapper key="glossary-terms-editor">
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
              Clicking in the <strong>Custom Name</strong> field allows you to
              edit the term directly. Clicking on the <strong>Settings</strong>{' '}
              button will open up more configuration options for that type of
              object, based on the System Name.
            </Typography>
          </MotionBox>
          <GlossaryPropertyLabels
            subModel="system"
            key="glossary-property-labels"
          />
        </AnimatePresence>
      </Box>
    </GlossaryMainWrapper>
  );
};

export default GlossaryTermsEditor;
