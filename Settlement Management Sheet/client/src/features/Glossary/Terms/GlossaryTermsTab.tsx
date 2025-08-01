import { selectGlossaryById } from '@/app/selectors/glossarySelectors.js';
import { AppDispatch } from '@/app/store.js';
import updateGlossaryThunk from '@/app/thunks/glossary/glossary/updateGlossaryThunk.js';
import { Tab } from '@/app/types/TabTypes.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';
import { Box } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { genreSectionDefaults } from '../utils/getTerm.js';
import { entryTypeRenderOrder } from '../utils/glossaryConstants.js';
import TermRowAndSettings from '../forms/TermRowAndSetting.js';
import { useState } from 'react';
import { updateTab } from '@/app/slice/tabSlice.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';
import { Typography } from '@mui/material';
import updateGlossaryTermThunk from '@/app/thunks/glossary/glossary/updateGlossaryTermThunk.js';

const GlossaryTermsTab = ({ tab }: { tab: Tab }) => {
  const dispatch: AppDispatch = useDispatch();
  const glossary = useSelector(selectGlossaryById(tab.id));
  if (!glossary) return null;

  const [activeIndex, setActiveIndex] = useState<number>(
    tab.viewState?.activeTermIndex || -1
  );

  const fallbacks =
    genreSectionDefaults[glossary.genre as Genre] ||
    genreSectionDefaults.Fantasy;

  const handleTermChange = (key: string, newTerm: string) => {
    if (!tab.glossaryId) return;
    dispatch(
      updateGlossaryTermThunk({
        id: tab.glossaryId,
        key,
        genre: glossary.genre,
        value: newTerm === ' ' ? fallbacks[key] : newTerm,
      })
    );
  };

  const handleEditClick = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
    dispatch(
      updateTab({
        tabId: tab.tabId,
        side: tab.side,
        keypath: 'viewState.activeTermIndex',
        updates: activeIndex === index ? -1 : index,
      })
    );
  };

  const termRenderOrder = ['System Name', 'glossary', ...entryTypeRenderOrder];

  const duration = 0.33;

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        width: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {activeIndex === -1 && (
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
        )}
        {termRenderOrder.map((type, index) => {
          if (activeIndex === -1 || activeIndex === index)
            return (
              <TermRowAndSettings
                key={type}
                index={index}
                activeIndex={activeIndex}
                setEditing={handleEditClick}
                handleTermChange={handleTermChange}
                entryType={type}
                fallbacks={fallbacks}
                glossary={glossary}
                duration={duration}
              />
            );
        })}
      </AnimatePresence>
    </Box>
  );
};

export default GlossaryTermsTab;
