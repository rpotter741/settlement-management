import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';
import getPropertyLabel, {
  genrePropertyLabelDefaults,
  SubSectionTypes,
} from '../getPropertyLabel.js';
import {
  alpha,
  Box,
  capitalize,
  darken,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import GlossaryTermEditor from '@/components/shared/DynamicForm/GlossaryTermEditor.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { isEven } from '@/utility/booleans/numberTests.js';
import useTheming from '@/hooks/layout/useTheming.js';
import updateGlossaryTermThunk from '@/app/thunks/glossary/glossary/updateGlossaryTermThunk.js';
import { useMemo } from 'react';
import { Tab } from '@/app/types/TabTypes.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { AnimatePresence } from 'framer-motion';

const GlossaryPropertyLabels = ({
  tab,
  glossary,
  entryType,
}: {
  tab: Tab;
  glossary: GlossaryStateEntry;
  entryType: SubSectionTypes;
}) => {
  const { darkenColor, getAlphaColor } = useTheming();
  const dispatch: AppDispatch = useDispatch();
  const labels = genrePropertyLabelDefaults[glossary.genre][entryType] || {};

  const handleTermChange = (key: string, newTerm: string | null) => {
    dispatch(
      updateGlossaryTermThunk({
        id: glossary.id,
        key,
        section: entryType,
        genre: glossary.genre,
        value: newTerm,
        tabId: tab.tabId,
      })
    );
  };

  return (
    <AnimatePresence>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            px: 2,
            height: '54px',
            alignItems: 'center',
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.divider, 0.5),
          }}
        >
          <Typography
            variant="body1"
            sx={{ width: '50%', textAlign: 'left', fontSize: '1.1rem' }}
          >
            System Name
          </Typography>
          <Typography
            variant="body1"
            sx={{ width: '50%', textAlign: 'left', fontSize: '1.1rem' }}
          >
            Custom Name
          </Typography>
        </Box>
        <List sx={{ pt: 0 }}>
          {Object.entries(labels).map(([systemName, fallbackName], n) => {
            const defaultValue = getPropertyLabel({
              glossary,
              section: entryType,
              key: systemName,
            });
            return (
              <ListItem
                key={systemName}
                sx={{
                  width: '100%',
                  display: 'flex',
                  height: '54px',
                  backgroundColor: isEven(n)
                    ? 'background.default'
                    : darkenColor({
                        color: 'background',
                        key: 'default',
                        amount: 0.1,
                      }),
                  borderLeft: '1px solid',
                  borderRight: '1px solid',
                  borderBottom:
                    n === Object.entries(labels).length - 1
                      ? '1px solid'
                      : 'none',
                  borderColor: (theme) => alpha(theme.palette.divider, 0.5),
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    width: '50%',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    flex: 1,
                  }}
                >
                  {capitalize(systemName)}
                </Typography>
                <GlossaryTermEditor
                  handleChange={(newTerm) => {
                    // Handle term change logic here
                    handleTermChange(systemName, newTerm);
                  }}
                  defaultTerm={defaultValue}
                  fallback={fallbackName}
                />
              </ListItem>
            );
          })}
        </List>
      </MotionBox>
    </AnimatePresence>
  );
};

export default GlossaryPropertyLabels;
