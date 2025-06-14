import React, { useState, useContext } from 'react';

import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ShellContext } from '@/context/ShellContext.js';
import { useTools } from 'hooks/useTools.jsx';

interface ToolSelectProps {
  options: string[];
  label: string;
  keypath: string;
  disabled?: boolean;
  width?: string;
}

const ToolSelect: React.FC<ToolSelectProps> = ({
  options,
  label,
  keypath,
  disabled = false,
  width = '100%',
}) => {
  const { tool, id } = useContext(ShellContext);
  const { edit, updateTool } = useTools(tool, id);
  const [value, setValue] = useState(edit ? edit[keypath] : '');
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

export default ToolSelect;
