import { selectActiveId } from '@/app/selectors/glossarySelectors.js';
import MotionBox, {
  RowMotionBox,
} from '@/components/shared/Layout/Motion/MotionBox.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { Box, Divider, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import TextBox from './TextBox.js';
import GenreSelect from '@/components/shared/Metadata/GenreSelect.js';
import Editor from '@/components/shared/TipTap/Editor.js';
import GlossaryMainWrapper from '../components/GlossaryMainWrapper.js';

const GlossaryOverview = () => {
  const { glossary, activeId, updateGlossary } = useGlossaryEditor();

  return (
    <GlossaryMainWrapper>
      <AnimatePresence mode="wait">
        {glossary ? (
          <RowMotionBox
            key={glossary.id ?? 'has'}
            layoutId="glossary-overview"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              py: 4,
              px: 4,
              backgroundColor: 'background.default',
              maxWidth: 700,
              width: 700,
              mx: 'auto',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    height: 150,
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      flex: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Glossary Name
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Change the display name of your world glossary.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 3 }}>
                    <TextBox
                      text={glossary.name}
                      onChange={(newText) => {}}
                      variant="h6"
                      fontSize="1.5rem"
                    />
                  </Box>
                </Box>
                <Divider flexItem sx={{ width: '33%' }} />
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    height: 150,
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      flex: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Genre & Sub-Genre
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, textAlign: 'start' }}
                    >
                      Change the genre and sub-genre of your world glossary.
                      Changes made after creation will not affect existing
                      entries, though any default terms will be updates to match
                      the new genre.
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 3 }}>
                    <GenreSelect
                      defaultGenre={glossary.genre as any}
                      defaultSubGenre={glossary.subGenre as any}
                      updateFn={updateGlossary}
                    />
                  </Box>
                </Box>
                <Divider flexItem sx={{ width: '66%', mt: 4 }} />
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    // height: 150,
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      flex: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Description
                    </Typography>
                    <Typography variant="subtitle2" sx={{ textAlign: 'start' }}>
                      Explain your world glossary. This description will be
                      shown to others.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Editor
              html={glossary.description.markdown}
              immediateOnChange={() => {}}
              width="100%"
            />
          </RowMotionBox>
        ) : (
          <MotionBox
            key="empty"
            layoutId="glossary-overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Typography>No Glossary Selected.</Typography>
            <Typography>Select a glossary or create a new one here.</Typography>
          </MotionBox>
        )}
      </AnimatePresence>
    </GlossaryMainWrapper>
  );
};

export default GlossaryOverview;
