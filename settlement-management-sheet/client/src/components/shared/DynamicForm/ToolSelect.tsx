import React, { useState, useContext } from 'react';

import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ShellContext } from '@/context/ShellContext.js';
import { useTools } from 'hooks/tools/useTools.jsx';

interface ToolSelectProps {
  options: { name: string; value: string }[];
  label: string;
  keypath: string;
  disabled?: boolean;
  width?: string;
  small?: boolean;
}

const ToolSelect: React.FC<ToolSelectProps> = ({
  options,
  label,
  keypath,
  disabled = false,
  width = '100%',
  small = true,
}) => {
  const { tool, id } = useContext(ShellContext);
  const { edit, updateTool, selectEditValue } = useTools(tool, id);
  const [value, setValue] = useState(selectEditValue(keypath));

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id={`select-${label}`}>{label}</InputLabel>
        <Select
          labelId={`select-${label}`}
          id={`select-${label}`}
          value={value}
          label={label}
          onChange={(e) => {
            setValue(e.target.value);
            updateTool(keypath, e.target.value);
          }}
          disabled={disabled}
          sx={{
            width,
            backgroundColor: 'background.paper',
            '& .MuiSelect-select': small
              ? {
                  padding: '8px 16px',
                }
              : {},
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ToolSelect;
