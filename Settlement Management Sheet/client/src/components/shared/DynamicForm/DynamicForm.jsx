import React, { useEffect, useState, useCallback } from 'react';
import { Formik, Form } from 'formik';
import { debounce } from 'lodash';
import {
  Box,
  TextField,
  Button,
  Tooltip,
  InputAdornment,
  IconButton,
  Divider,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TrashIcon from '@mui/icons-material/Delete';
import AutoStoryIcon from '@mui/icons-material/AutoStories';
import WarningIcon from '@mui/icons-material/Warning';

const DynamicForm = ({
  initialValues,
  index,
  field,
  onSubmit,
  boxSx,
  externalUpdate,
  onRemove,
  onMoreDetails,
  glossaryLink,
  shrink = false,
  onError = null,
  parentError,
  min,
  isExpanded = false,
  onBlur,
  debounced = false,
}) => {
  const wrappedValidate = (value) => field.validate(value);
  const [isError, setIsError] = useState(parentError);
  const [firstCheck, setFirstCheck] = useState(true);

  const handleExternalUpdate = useCallback(
    (value, { keypath, id, index, name }) => {
      if (debounced) {
        debounce((value, { keypath, id, index, name }) => {
          if (externalUpdate) {
            externalUpdate(value, { keypath, id, index, name });
          }
        }, 500);
      } else {
        if (externalUpdate) {
          externalUpdate(value, { keypath, id, index, name });
        }
      }
    }
  );

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const error = wrappedValidate(values[field.name]);
        return { [field.name]: error || null };
      }}
      onSubmit={onSubmit}
    >
      {({
        values,
        handleChange,
        handleBlur,
        touched,
        errors,
        isSubmitting,
        validateField,
      }) => {
        const {
          name,
          label,
          type,
          tooltip,
          textSx,
          validate,
          keypath,
          id,
          objType,
          placeholder,
          index,
          ...rest
        } = field;
        // Determine styles based on validity
        const isValid = touched[name] && !errors[name];
        const isInvalid = touched[name] && errors[name];

        useEffect(() => {
          if (parentError) {
            setIsError(true);
            touched[name] = true;
            validateField(name);
          }
        }, [parentError, isExpanded]);

        useEffect(() => {
          if (firstCheck) {
            if (parentError) {
              setIsError(true);
              validateField(name);
            }
            setFirstCheck(false);
          } else {
            if (errors[name] || parentError) {
              setIsError(true);
              touched[name] = true;
              if (onError) {
                onError(errors[name], {
                  keypath,
                  id,
                  index,
                  name,
                });
              }
            } else {
              setIsError(false);
              if (onError) {
                onError(null, {
                  keypath,
                  id,
                  index,
                  name,
                });
              }
            }
          }
        }, [errors, name, keypath, id]);

        return (
          <Box sx={boxSx ? { ...boxSx } : {}}>
            <Form>
              <TextField
                name={name}
                label={label}
                type={type || 'text'}
                value={values[name]}
                onChange={(e) => {
                  handleChange(e);
                  if (externalUpdate) {
                    if (type === 'number') {
                      handleExternalUpdate(Number(e.target.value), {
                        keypath,
                        id,
                        index,
                        name,
                      });
                    } else {
                      handleExternalUpdate(e.target.value, {
                        id,
                        keypath,
                        index,
                        name,
                      });
                    }
                  }
                }}
                placeholder={placeholder}
                onBlur={(e) => {
                  handleBlur(e);
                  if (onBlur) {
                    onBlur();
                  }
                }}
                error={Boolean(isInvalid) || Boolean(parentError)} // Set error state
                helperText={errors[name]} // Display error text
                fullWidth
                min={min}
                margin="normal"
                sx={{
                  // Dynamic border styles
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: !parentError
                        ? 'success.main'
                        : isInvalid
                          ? 'error.main'
                          : 'secondary.main',
                    },
                    '&:hover fieldset': {
                      borderColor: isValid
                        ? 'success.main'
                        : isInvalid || isError
                          ? 'error.main'
                          : '',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isValid
                        ? 'success.main'
                        : isInvalid || isError
                          ? 'error.main'
                          : '',
                    },
                  },
                  mb: 2,
                  ...textSx,
                }}
                slotProps={{
                  inputLabel: {
                    shrink: touched[name] || shrink,
                    sx: {
                      fontWeight: 'bold',
                      color: isValid
                        ? 'success.main'
                        : isInvalid
                          ? 'error.main'
                          : '',
                    },
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {isError && parentError && (
                          <Tooltip
                            title={
                              <>
                                {parentError ? (
                                  <Typography variant="body2">
                                    {parentError ||
                                      'This field needs correction'}
                                  </Typography>
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
                        )}
                        {tooltip && (
                          <Tooltip
                            title={
                              <>
                                <Typography variant="body2">
                                  {tooltip}
                                </Typography>
                              </>
                            }
                            arrow
                          >
                            <IconButton
                              onClick={
                                glossaryLink ? () => glossaryLink(label) : null
                              }
                            >
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
                          <>
                            <Divider orientation="vertical" flexItem />
                            <Tooltip
                              title={
                                <>
                                  <Typography variant="body2">
                                    {`View ${label} Details`}
                                  </Typography>
                                </>
                              }
                              arrow
                            >
                              <IconButton
                                fontSize="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMoreDetails(id, objType);
                                }}
                              >
                                <AutoStoryIcon
                                  fontSize="small"
                                  sx={{ color: 'success.main' }}
                                />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {onRemove && (
                          <>
                            <Divider orientation="vertical" flexItem />
                            <Tooltip
                              title={
                                <>
                                  <Typography variant="body2">
                                    Remove {label}
                                  </Typography>
                                </>
                              }
                              arrow
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemove(keypath);
                                }}
                              >
                                <TrashIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </InputAdornment>
                    ),
                  },
                  formHelperText: {
                    sx: {
                      position: 'absolute',
                      bottom: '-20px',
                      fontSize: '12px', // Optional: Adjust font size
                      color: isInvalid ? 'error.main' : 'transparent',
                      display: ['none', 'none', 'block'], // Optional: Hide on mobile
                    },
                  },
                }}
                {...rest}
              />
              {onSubmit && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                >
                  Submit
                </Button>
              )}
            </Form>
          </Box>
        );
      }}
    </Formik>
  );
};

export default DynamicForm;
