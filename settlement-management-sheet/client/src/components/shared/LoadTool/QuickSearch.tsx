import React, { useState, useRef, useEffect } from 'react';

import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  InputLabel,
  Button,
} from '@mui/material';
import { useSelector } from 'react-redux';

import defaultKit from '@/features/Kits/helpers/defaultKit.js';
import defaultSettlement from '@/features/Kits/helpers/defaultSettlement.js';
import mergeKit from '@/features/Kits/helpers/mergeObjects.js';
import { capitalize } from 'lodash';

const baseData = mergeKit(defaultKit, defaultSettlement);
let sampleDataArray = [];
Object.entries(baseData).forEach(([categoryKey, categoryEntries]) => {
  categoryEntries.forEach((item) => {
    sampleDataArray.push({ ...item, model: categoryKey });
  });
});

const QuickSearch: React.FC = () => {
  return (
    <Box sx={{ minWidth: [300, 400, 500], padding: 2 }}>
      <Autocomplete
        multiple
        freeSolo
        getOptionLabel={(option: any) => option.name}
        filterOptions={(options, state) =>
          options
            .filter((option) =>
              option.name.toLowerCase().includes(state.inputValue.toLowerCase())
            )
            .slice(0, 50)
        }
        options={[...sampleDataArray]}
        groupBy={(option) => capitalize(option.model)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search glossary entries and tools..."
            fullWidth
            variant="outlined"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: 1,
            }}
            {...props}
            key={option.id || option.name} // <-- Add a unique key here
          >
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              {option.name}
            </Typography>
          </Box>
        )}
        onChange={(event, value) => {
          // Handle search logic here
          console.log('Search value:', value);
        }}
        onInputChange={(event, value) => {
          // Handle input change logic here
          console.log('Input changed:', value);
        }}
        sx={{ width: '100%' }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 400,
              overflowY: 'auto',
              width: '100%',
              boxShadow: (theme) => theme.shadows[3],
            },
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Button
          color="warning"
          variant="outlined"
          onClick={() => {
            // Handle search button click
            console.log('Cancel button clicked');
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="info"
          sx={{ ml: 2 }}
          onClick={() => {
            // Handle search button click
            console.log('Open button clicked');
          }}
        >
          Open Tab(s)
        </Button>
      </Box>
    </Box>
  );
};

export default QuickSearch;
