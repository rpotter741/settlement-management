import React, { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  TextField,
  InputLabel,
} from '@mui/material';

import useSharedHooks from '@/hooks/utility/useSharedHooks.js';
import { Genre } from 'types/index.js';

export const genreOptions = [
  'Agnostic',
  'Fantasy',
  'Sci-Fi',
  'Western',
  'Horror',
  'Modern',
  'Other',
] as const;

export const subGenreMap: Record<Genre, string[]> = {
  Agnostic: [],
  Fantasy: [
    'High Fantasy',
    'Dark Fantasy',
    'Urban Fantasy',
    'Epic Fantasy',
    'Sword and Sorcery',
  ],
  'Sci-Fi': [
    'Space Opera',
    'Cyberpunk',
    'Dystopian',
    'Time Travel',
    'Alien Invasion',
  ],
  Western: ['Classic Western', 'Spaghetti Western', 'Modern Western'],
  Horror: ['Psychological Horror', 'Supernatural Horror', 'Gothic Horror'],
  Modern: ['Contemporary Fiction', 'Realistic Fiction'],
  Other: [],
};

const defaultSx = {
  outer: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    pl: 2,
    pr: 1,
    flexGrow: 1,
    flexShrink: 2,
    width: '100%',
    boxSizing: 'border-box',
  },
  inner: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    pl: 2,
    boxSizing: 'border-box',
  },
};

interface GenreSelectProps {
  sx?: React.CSSProperties;
  innerSx?: React.CSSProperties;
  defaultGenre: Genre;
  defaultSubGenre: string;
  updateFn: (field: 'genre' | 'subGenre', value: string) => void;
}

const GenreSelect: React.FC<GenreSelectProps> = ({
  sx = defaultSx.outer,
  innerSx = defaultSx.inner,
  defaultGenre,
  defaultSubGenre,
  updateFn,
}) => {
  const { utils } = useSharedHooks();

  const [customSnackbar, setCustomSnackbar] = useState(false);

  const [genreInputValue, setGenreInputValue] = useState<Genre | ''>(
    defaultGenre
  );
  const [subGenreInputValue, setSubGenreInputValue] = useState(defaultSubGenre);

  return (
    <Box sx={sx}>
      <Box sx={innerSx}>
        <Typography
          variant="body1"
          sx={{ width: { xs: '20%', md: '40%' }, textAlign: 'left' }}
        >
          Genre:
        </Typography>
        <Autocomplete
          inputValue={genreInputValue}
          options={genreOptions}
          onChange={(event, newValue) => {
            if (newValue !== null) {
              setGenreInputValue(newValue);
              updateFn('genre', newValue);
              updateFn('subGenre', ''); // Reset sub-genre when genre changes
              setSubGenreInputValue('');
            } else {
              setGenreInputValue('');
              setSubGenreInputValue('');
              updateFn('genre', '');
              updateFn('subGenre', '');
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Genre"
              variant="outlined"
              fullWidth
              onChange={(e) => setGenreInputValue(e.target.value as Genre)}
            />
          )}
          sx={{ width: { xs: '80%', md: '60%' } }}
        />
      </Box>
      {defaultGenre !== 'Agnostic' && (
        <Box sx={innerSx}>
          <Typography
            variant="body1"
            sx={{ textAlign: 'left', width: { xs: '20%', md: '40%' } }}
          >
            Sub-Genre:
          </Typography>
          <Autocomplete
            freeSolo={defaultGenre === 'Other'}
            inputValue={subGenreInputValue}
            options={subGenreMap[defaultGenre as Genre] || []}
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setSubGenreInputValue(newValue);
                updateFn('subGenre', newValue);
              } else {
                setSubGenreInputValue('');
                updateFn('subGenre', '');
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sub-Genre"
                variant="outlined"
                fullWidth
                onChange={(e) => setSubGenreInputValue(e.target.value)}
              />
            )}
            sx={{ width: { xs: '80%', md: '60%' } }}
            onFocus={() => {
              if (!customSnackbar && defaultGenre === 'Other') {
                setCustomSnackbar(true);
                utils.snackbar({
                  message:
                    "I don't know all the genres there are. Feel free to add one of your own!",
                  type: 'info',
                });
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default GenreSelect;
