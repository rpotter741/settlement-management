import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  useContext,
} from 'react';
import { ShellContext } from '@/context/ShellContext.js';
import { useTools } from '@/hooks/useTools.js';

import { debounce } from 'lodash';
import {
  Box,
  TextField,
  Tooltip,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  AutoStories,
  Delete,
} from '@mui/icons-material';

import toSnakeCase from 'utility/snakeCase.js';

const debouncedUpdate = debounce((callback, value, meta) => {
  callback(value, meta);
}, 500);

interface ToolInputProps {
  placeholder?: string;
  style?: Record<string, any>;
  snakeCase?: boolean;
  debounced?: boolean;
  multiline?: boolean;
  inputConfig: {
    label: string;
    type: string;
    tooltip?: string;
    validateFn?: (value: any) => string | null;
    keypath: string;
  };
  shrink?: boolean;
  onBlur?: () => void;
  onMoreDetails?: () => void;
  onRemove?: () => void;
}

export interface ToolInputConfig {
  label: string;
  type: string;
  tooltip?: string;
  validateFn?: (value: any) => string | null;
  keypath: string;
}

const ToolInput: React.FC<ToolInputProps> = ({
  placeholder = '',
  style = {},
  snakeCase = false,
  debounced = false,
  multiline = false,
  inputConfig,
  shrink = true,
  onBlur = () => {},
  onMoreDetails,
  onRemove,
}) => {
  const { tool, id } = useContext(ShellContext);
  const { selectEditValue, updateTool, validateToolField, selectErrorValue } =
    useTools(tool, id);
  const { label, type = 'text', tooltip, validateFn, keypath } = inputConfig;
  const error = selectErrorValue(keypath);
  const val = selectEditValue(keypath);

  const [touched, setTouched] = useState<boolean>(false);
  const [invalid, setInvalid] = useState<boolean>(true);
  const [value, setValue] = useState<string | number>(val ?? '');

  useEffect(() => {
    if (touched && !error) {
      setInvalid(false);
    } else if (touched && error) {
      setInvalid(true);
    }
  }, [touched, error]);

  const processChange = useCallback(
    (e: any) => {
      if (type === 'number') {
        const value = Number(e.target.value);
        updateTool(keypath, value);
        setValue(value);
        const error = validateFn?.(value) || null;
        validateToolField(keypath, error);
      } else {
        const value = snakeCase ? toSnakeCase(e.target.value) : e.target.value;
        e.target.value = value;
        updateTool(keypath, value);
        setValue(value);
        const error = validateFn?.(value) || null;
        validateToolField(keypath, error);
      }
    },
    [keypath, type, snakeCase, updateTool, validateFn, validateToolField]
  );

  const handleChange = useMemo(() => {
    return debounced
      ? (e: any) => {
          debouncedUpdate(processChange, e, { keypath });
        }
      : (e: any) => {
          processChange(e);
        };
  }, [debounced, processChange, keypath]);

  return (
    <Box sx={{ ...style }}>
      <TextField
        label={label}
        multiline={multiline}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        helperText={touched ? error : ''} // Display error text
        fullWidth
        margin="normal"
        onFocus={() => setTouched(true)}
        onBlur={(e) => {
          setTouched(true);
          if (onBlur) {
            onBlur();
          }
          if (debounced) {
            debouncedUpdate.flush();
          }
        }}
        sx={{
          // Dynamic border styles
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: !error
                ? 'success.main'
                : invalid
                  ? 'error.main'
                  : 'secondary.main',
            },
            '&:hover fieldset': {
              borderColor: !error
                ? 'success.main'
                : invalid || error
                  ? 'error.main'
                  : '',
            },
            '&.Mui-focused fieldset': {
              borderColor: !error
                ? 'success.main'
                : invalid || error
                  ? 'error.main'
                  : '',
            },
          },
          mb: 2,
        }}
        slotProps={{
          inputLabel: {
            shrink: !!touched || shrink,
            sx: {
              fontWeight: 'bold',
              color: !error
                ? 'success.main'
                : !invalid
                  ? 'success.main'
                  : 'error.main',
              '&.Mui-focused': {
                color: !invalid ? 'success.main' : 'error.main',
              },
            },
          },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {error ? (
                  <Tooltip
                    title={
                      <>
                        {error ? (
                          <Typography variant="body2">{error}</Typography>
                        ) : (
                          <Typography variant="body2">
                            {'This field needs correction'}
                          </Typography>
                        )}
                      </>
                    }
                    arrow
                  >
                    <IconButton>
                      <WarningIcon
                        fontSize="small"
                        sx={{ color: 'error.main' }}
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Box sx={{ width: '36px' }} />
                )}
                {tooltip && (
                  <Tooltip
                    title={
                      <>
                        <Typography variant="body2">{tooltip}</Typography>
                      </>
                    }
                    arrow
                  >
                    <IconButton>
                      {/* @ts-ignore */}
                      <InfoIcon
                        fontSize="small"
                        sx={{
                          cursor: 'pointer',
                          color: 'secondary.main',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
                {onMoreDetails && (
                  <Tooltip title={`Click for ${label} details`} arrow>
                    <IconButton
                      onClick={onMoreDetails}
                      sx={{ color: 'primary.main' }}
                    >
                      <AutoStories fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onRemove && (
                  <Tooltip title={`Remove ${label}`} arrow>
                    <IconButton onClick={onRemove} sx={{ color: 'error.main' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </InputAdornment>
            ),
          },
          formHelperText: {
            sx: {
              position: 'absolute',
              bottom: '-20px',
              fontSize: '12px', // Optional: Adjust font size
              color: invalid ? 'error.main' : 'transparent',
              display: {
                xs: 'none',
                xl: 'block',
              }, // Optional: Hide on mobile
            },
          },
        }}
      />
    </Box>
  );
};

export default ToolInput;
