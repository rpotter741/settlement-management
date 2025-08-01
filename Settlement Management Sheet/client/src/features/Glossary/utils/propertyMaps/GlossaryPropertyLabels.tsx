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
import updateGlossaryThunk from '@/app/thunks/glossary/glossary/updateGlossaryThunk.js';
import { useDispatch } from 'react-redux';
import { isEven } from '@/utility/booleans/numberTests.js';
import useTheming from '@/hooks/layout/useTheming.js';

const GlossaryPropertyLabels = ({
  glossary,
}: {
  glossary: GlossaryStateEntry;
}) => {
  const { darkenColor } = useTheming();
  const dispatch: AppDispatch = useDispatch();
  const labels = genrePropertyLabelDefaults[glossary.genre] || {};

  const handleTermChange = (key: string, newTerm: string) => {
    if (newTerm === ' ' || newTerm.trim() === '') return;
    dispatch(
      updateGlossaryThunk({
        id: glossary.id,
        updates: {
          integrationState: {
            ...glossary.integrationState,
            [key]: newTerm,
          },
        },
      })
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {Object.entries(labels).map(([section, keys]) => (
        <Box
          key={section}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: '100%',
              position: 'sticky',
              height: '54px',
              top: 54,
              backgroundColor: (theme) =>
                alpha(theme.palette.background.default, 1),
              mt: 2,
              zIndex: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              {capitalize(section)}
            </Typography>
          </Box>
          <List>
            {Object.entries(keys).map(([k, v], n) => {
              const defaultValue = getPropertyLabel({
                glossary,
                section: section as SubSectionTypes,
                key: k,
              });
              if (!defaultValue) return null;
              return (
                <ListItem
                  key={k}
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
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ width: '50%', textAlign: 'left', fontWeight: 'bold' }}
                  >
                    {capitalize(k)}
                  </Typography>
                  <GlossaryTermEditor
                    handleChange={(newTerm) => {
                      // Handle term change logic here
                      handleTermChange(k, newTerm);
                    }}
                    defaultTerm={defaultValue}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default GlossaryPropertyLabels;
