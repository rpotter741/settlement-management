import React, { useState } from 'react';
import { TextField, Box, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TrashIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const ValidatedTextField = ({
  label,
  value: propValue,
  onChange,
  keyPath,
  onRemove,
  step = 1,
  validation, // Function for validation
  validated = false, // Boolean to apply success styling
  errorText = 'Invalid input', // Text to display when error
  validatedText = '', // Text to display when validated
  tooltipText,
  ...props
}) => {
  const [error, setError] = useState(false);

  // Handle input change and validation
  const handleChange = (e) => {
    const newValue = e.target.value;

    // Validate using the passed validation function
    if (validation) {
      setError(!validation(newValue));
    }

    onChange(keyPath ? keyPath : newValue, newValue);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        mt: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <TextField
        label={
          <>
            {tooltipText && (
              <Tooltip title={tooltipText}>
                {label}
                <InfoIcon />
              </Tooltip>
            )}
            {!tooltipText && label}
          </>
        }
        value={propValue}
        onChange={handleChange}
        error={error}
        variant={tooltipText ? 'standard' : 'outlined'}
        slotProps={{
          input: {
            step: 0.1,
            endAdornment: onRemove && (
              <InputAdornment position="end">
                <IconButton onClick={onRemove}>
                  <TrashIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
          inputLabel: {
            shrink: tooltipText && true,
            sx: {
              fontSize: tooltipText && '1.2rem',
            },
          },
          formHelperText: {
            sx: {
              position: 'relative',
              left: 0,
              whiteSpace: 'nowrap',
            },
          },
        }}
        helperText={error ? errorText : ' '}
        {...props}
        sx={{
          '& .MuiInputLabel-root': {
            color: validated
              ? 'success.main'
              : error
                ? 'error.main'
                : 'primary.main', // Default label color
            '&.Mui-focused': {
              color: validated
                ? 'success.main'
                : error
                  ? 'error.main'
                  : 'primary.main', // Label color when focused
            },
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: validated
                ? 'success.main'
                : error
                  ? 'error.main'
                  : 'primary.main', // Border color when focused
            },
          },
          position: 'relative',
        }}
      />
    </Box>
  );
};

export default ValidatedTextField;
