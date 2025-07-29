import { selectGlossaryById } from '@/app/selectors/glossarySelectors.js';
import { AppDispatch } from '@/app/store.js';
import updateGlossaryThunk from '@/app/thunks/glossary/glossary/updateGlossaryThunk.js';
import { Tab } from '@/app/types/TabTypes.js';
import GlossaryTermEditor from '@/components/shared/DynamicForm/GlossaryTermEditor.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';

import { Button, capitalize, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import getTerm, { genreDefaults } from '../../utils/getTerm.js';
import { entryTypeRenderOrder } from '../../utils/glossaryConstants.js';

const GlossaryTerms = ({ tab }: { tab: Tab }) => {
  const dispatch: AppDispatch = useDispatch();
  const glossary = useSelector(selectGlossaryById(tab.id));
  if (!glossary) return null;

  const fallbacks =
    genreDefaults[glossary.genre as Genre] || genreDefaults.Fantasy;

  const handleTermChange = (key: string, newTerm: string) => {
    if (!tab.glossaryId) return;
    dispatch(
      updateGlossaryThunk({
        id: tab.glossaryId,
        updates: {
          integrationState: {
            ...glossary.integrationState,
            [key]: newTerm === ' ' ? fallbacks[key] : newTerm,
          },
        },
      })
    );
  };

  const termRenderOrder = ['System Name', 'glossary', ...entryTypeRenderOrder];

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}
    >
      {termRenderOrder.map((type, index) => (
        <Box
          key={type}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            mb: 1,
            minHeight: '44px',
          }}
        >
          <Typography
            variant={index === 0 ? 'h6' : 'body1'}
            sx={{ width: '40%', textAlign: 'left' }}
          >
            {capitalize(type)}
          </Typography>
          <Box
            sx={{
              width: '40%',
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
                {fallbacks[type]}
              </Typography>
            ) : (
              <GlossaryTermEditor
                handleChange={(newTerm) => {
                  handleTermChange(type, newTerm);
                }}
                defaultTerm={getTerm({
                  glossary,
                  key: type,
                })}
              />
            )}
          </Box>
          {index > 0 ? (
            <Box sx={{ width: '20%' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  // Handle term edit or creation logic here
                  console.log(`Edit ${type}`);
                }}
              >
                Edit
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: '20%' }} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default GlossaryTerms;
