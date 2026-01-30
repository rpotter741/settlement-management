import React, { useEffect, useState, useCallback, useContext } from 'react';
import { ShellContext } from '@/context/ShellContext.js';
import { useTools } from '@/hooks/tools/useTools.js';

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

import toSnakeCase from '@/utility/inputs/snakeCase.js';
import limitXDecimals from '@/utility/style/limitXDecimals.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { updateTab } from '@/app/slice/tabSlice.js';

const debouncedUpdate = debounce((callback, value, error, keypath) => {
  callback(value, error, keypath);
}, 250);

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
  dynamicLabel?: string;
  shrink?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  onMoreDetails?: () => void;
  onRemove?: () => void;
  decimals?: number;
  allowZero?: boolean;
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
  debounced = true,
  multiline = false,
  inputConfig,
  disabled = false,
  shrink = true,
  onBlur = () => {},
  onMoreDetails,
  onRemove,
  dynamicLabel,
  decimals = 2,
  allowZero = true,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { tool, id, tab } = useContext(ShellContext);
  const {
    selectStaticValue,
    selectEditValue,
    updateTool,
    validateToolField,
    selectErrorValue,
  } = useTools(tool, id);
  const { label, type = 'text', tooltip, validateFn, keypath } = inputConfig;
  const error = selectErrorValue(keypath);
  const val = selectEditValue(keypath);
  const staticVal = selectStaticValue(keypath);

  const [touched, setTouched] = useState<boolean>(false);
  const [invalid, setInvalid] = useState<boolean>(true);
  const [value, setValue] = useState<string | number>(val ?? '');

  useEffect(() => {
    if (touched && !!!error) {
      setInvalid(false);
    } else if (touched && error) {
      setInvalid(true);
    }
  }, [touched, error]);

  const processChange = useCallback(
    (e: any) => {
      if (type === 'number') {
        const normalizedValue = limitXDecimals(e.target.value, decimals);
        let value = allowZero ? normalizedValue : Math.max(1, normalizedValue);
        e.target.value = value; // Update the input value to the normalized one
        setValue(value);
        const error = validateFn?.(value) || null;
        return { value: Number(value), error };
      } else {
        const value = snakeCase ? toSnakeCase(e.target.value) : e.target.value;
        e.target.value = value;
        setValue(value);
        const error = validateFn?.(value) || null;
        return { value, error };
      }
    },
    [keypath, type, snakeCase, updateTool, validateFn, validateToolField]
  );

  const sendChangeUpstream = useCallback(
    (value: any, newError: any) => {
      updateTool(keypath, value || ' ');
      validateToolField(keypath, newError);
      if (value !== staticVal) {
        dispatch(
          updateTab({
            tabId: tab.tabId,
            side: tab.side,
            keypath: 'viewState.isDirty',
            updates: true,
          })
        );
      }
    },
    [keypath, staticVal]
  );

  const handleChange = useCallback(
    (e: any) => {
      const { value, error } = processChange(e);
      if (debounced) {
        debouncedUpdate(sendChangeUpstream, value, error, { keypath });
      } else {
        sendChangeUpstream(value, error);
      }
    },
    [debounced, processChange, keypath]
  );

  return (
    <Box sx={{ ...style }}>
      <TextField
        disabled={disabled}
        label={dynamicLabel || label}
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
                  ? 'warning.main'
                  : 'secondary.main',
            },
            '&:hover fieldset': {
              borderColor: !error
                ? 'success.main'
                : invalid || error
                  ? 'warning.main'
                  : '',
            },
            '&.Mui-focused fieldset': {
              borderColor: !error
                ? 'success.main'
                : invalid || error
                  ? 'warning.main'
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
                  : 'warning.main',
              '&.Mui-focused': {
                color: !invalid ? 'success.main' : 'warning.main',
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
                        sx={{ color: 'warning.main' }}
                      />
                    </IconButton>
                  </Tooltip>
                ) : null}
                {tooltip && !disabled && (
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
                    <IconButton
                      onClick={onRemove}
                      sx={{ color: 'warning.main' }}
                    >
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
              fontSize: '10px', // Optional: Adjust font size
              color: invalid ? 'warning.main' : 'transparent',
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
