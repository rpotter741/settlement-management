import React, { useState, useEffect } from 'react';

import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SelectOptions = ({
  options,
  onChange,
  value,
  label,
  disabled = false,
  width = '100%',
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id={`select-${label}`}>{label}</InputLabel>
        <Select
          labelId={`select-${label}`}
          id={`select-${label}`}
          value={value}
          label={label}
          onChange={onChange}
          disabled={disabled}
          sx={{
            width,
            backgroundColor: 'background.paper',
            '& .MuiSelect-select': {
              padding: '8px 16px',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectOptions;
