import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  initializeAttribute,
  selectAttribute,
  updateAttribute,
} from '../../../features/attribute/attributeSlice.js';
import { useSnackbar } from '../../../context/SnackbarContext.jsx';

import {
  selectKey,
  clearKey,
} from '../../../features/selection/selectionSlice.js';

import {
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
  Tooltip,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';

import IconSelector from '../../utils/IconSelector/IconSelector.jsx';
import EditAttribute from './EditAttribute.jsx';
import PreviewAttribute from './PreviewAttribute.jsx';
import ChecklistContent from '../components/ChecklistContent.jsx';

const CreateAttribute = () => {
  const { showSnackbar } = useSnackbar();
  const [editMode, setEditMode] = useState(false);
  const [localAttr, setLocalAttr] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [validationObj, setValidationObj] = useState({});
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const dispatch = useDispatch();

  const attr = useSelector(selectAttribute);
  const allIds = useSelector((state) => state.attributes.allIds);

  const initializeValidationObj = (attr) => {
    const validationObj = { ...attr };

    // Set all errors to null
    Object.keys(validationObj).forEach((key) => {
      if (Array.isArray(validationObj[key])) {
        validationObj[key] = validationObj[key].map((item) =>
          typeof item === 'object' ? initializeValidationObj(item) : null
        );
      } else if (typeof validationObj[key] === 'object') {
        validationObj[key] = initializeValidationObj(validationObj[key]);
      } else {
        validationObj[key] = null;
      }
    });
    delete validationObj.icon;
    delete validationObj.iconColor;
    delete validationObj.tags;
    return validationObj;
  };

  const validateAttribute = (attr) => {
    const newErrors = { ...errors };

    // Validate top-level fields
    if (!attr.name || attr.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }
    if (attr.values.maxPerLevel <= 0) {
      newErrors.values.maxPerLevel = 'Max per level must be greater than 0.';
    }
    if (attr.values.maxPerLevel > 10) {
      newErrors.values.maxPerLevel = 'Max per level cannot be greater than 10.';
    }
    if (attr.costPerLevel <= 0) {
      newErrors.costPerLevel = 'Cost per level must be greater than 0.';
    }
    if (attr.healthPerLevel < 0) {
      newErrors.healthPerLevel = 'Health per level cannot be negative.';
    }
    if (!attr.description || attr.description.trim().length < 30) {
      newErrors.description = 'Description must be at least 30 characters.';
    }

    // Validate thresholds
    newErrors.thresholds = attr.thresholds.map((threshold) => {
      const thresholdErrors = {};
      if (!threshold.name || threshold.name.trim().length === 0) {
        thresholdErrors.name = 'Threshold name is required.';
      }
      if (threshold.max <= 0 || threshold.max > 100) {
        thresholdErrors.max = 'Threshold max must be between 1 and 100.';
      }
      thresholdErrors.id = threshold.id;
      return Object.keys(thresholdErrors).length > 0 ? thresholdErrors : null;
    });

    // Remove empty arrays/nulls
    if (newErrors.thresholds.every((item) => item === null)) {
      delete newErrors.thresholds;
    }
    console.log(newErrors);
    return newErrors;
  };

  const getErrorCount = (errors) => {
    let count = 0;

    const countErrors = (errorObj) => {
      if (Array.isArray(errorObj)) {
        // If it's an array, count non-null/undefined values
        errorObj.forEach((item) => {
          if (item && typeof item === 'object') {
            countErrors(item); // Recursively check nested objects/arrays
          } else if (item !== null && item !== undefined) {
            count++;
          }
        });
      } else if (errorObj && typeof errorObj === 'object') {
        // If it's an object, traverse its keys
        Object.entries(errorObj).forEach(([key, value]) => {
          if (key !== 'id') {
            countErrors(value); // Recursively check nested objects/arrays
          }
        });
      } else if (errorObj !== null && errorObj !== undefined) {
        // Count primitive values that are not null or undefined
        count++;
      }
    };

    countErrors(errors); // Start recursion
    return count;
  };

  // if no active, create a new one
  useEffect(() => {
    if (!attr) {
      setEditMode(true);
      dispatch(initializeAttribute());
    }
  }, [attr, dispatch]);

  // if no active, select the newly created one
  useEffect(() => {
    if (!attr && allIds.length > 0) {
      const lastId = allIds[allIds.length - 1];
      dispatch(selectKey({ key: 'attribute', value: lastId }));
    }
  }, [attr, allIds, dispatch]);

  useEffect(() => {
    if (attr) {
      setLocalAttr(attr);
      setErrors(initializeValidationObj(attr));
      getErrorCount(errors);
    }
  }, [attr]);

  const handleIconUpdate = (icon, color) => {
    dispatch(
      updateAttribute({
        id: attr.id,
        updates: { icon, iconColor: color },
      })
    );
    setShowModal(null);
  };

  const handleIconColorChange = (color) => {
    dispatch(
      updateAttribute({
        id: attr.id,
        updates: { iconColor: color },
      })
    );
  };

  useEffect(() => {
    setErrorCount(getErrorCount(errors));
  }, [errors]);

  const handleCancelLoad = () => {
    if (editMode) {
      setEditMode(false);
      setLocalAttr(attr);
      setErrors(initializeValidationObj(attr));
    } else {
      console.log('Load attribute');
    }
  };

  const handleSaveEdit = () => {
    if (editMode) {
      const errors = validateAttribute(localAttr);
      const count = getErrorCount(errors);
      if (count > 0) {
        setErrors(errors);
        showSnackbar('Please correct the errors on the form.', 'error');
        setExpanded(true);
        //enable validation errors to be pulled out on button press again
        setTimeout(() => setExpanded(false), 1000);
        return;
      } else {
        setErrors(null);
        setEditMode(false);
        dispatch(updateAttribute({ id: attr.id, updates: localAttr }));
      }
    } else {
      setEditMode(true);
    }
  };

  if (!attr) {
    return <Box>Loading...</Box>;
  }

  if (attr !== null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          flexDirection: 'column',
          alignItems: 'center',
          width: ['100%'],
          position: 'relative',
          height: '100%',
        }}
      >
        {/* form preview */}
        {editMode && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: 'auto',
              backgroundColor: 'background.paper',
              boxShadow: 4,
              borderRadius: 4,
              transition: 'transform 0.4s ease-in-out',
              zIndex: 1000,
            }}
          >
            <ChecklistContent
              errors={errors}
              errorCount={errorCount}
              defaultExpand={expanded}
            />
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            mb: 2,
            overflowY: 'scroll',
            overflowX: 'show',
            boxShadow: 4,
            borderRadius: 4,
            backgroundColor: 'background.paper',
            width: ['100%', '80%', '60%', '50%', '40%'],
            position: 'relative',
            height: '100%',
          }}
        >
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              top: 24,
              right: 32,
              backgroundColor: editMode ? 'primary.main' : 'accent.main',
              color: editMode ? 'common.white' : 'text.primary',
            }}
            onClick={() => {
              handleCancelLoad();
            }}
          >
            {editMode ? 'Cancel Edit' : 'Load Attribute'}
          </Button>
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              top: 24,
              left: 32,
              backgroundColor: editMode ? 'success.main' : 'info.main',
            }}
            onClick={() => handleSaveEdit()}
          >
            {editMode ? 'Save Attribute' : 'Edit Attribute'}
          </Button>
          <Typography
            variant="h4"
            sx={{
              width: '100%',
              textAlign: 'center',
              gridColumn: 'span 3',
              color: 'primary.main',
              mt: 4,
              mb: 8,
            }}
          >
            CUSTOM ATTRIBUTE
          </Typography>
          <Modal open={showModal !== null} onClose={() => setShowModal(null)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.default',
                border: '2px solid #000',
                borderColor: 'secondary.light',
                boxShadow: 24,
                p: 4,
                borderRadius: 4,
              }}
            >
              {showModal === 'Custom Settlement Type' && (
                <Box>Choose a settlement type</Box>
              )}
              {showModal === 'Change Icon' && (
                <IconSelector
                  initialIcon={localAttr.icon}
                  color={localAttr.iconColor}
                  setColor={handleIconColorChange}
                  onConfirm={handleIconUpdate}
                />
              )}
            </Box>
          </Modal>
          <Box
            sx={{
              gridColumn: 'span 3',
              display: 'flex',
              gap: 2,
              width: '100%',
            }}
          >
            {editMode ? (
              <EditAttribute
                attr={localAttr}
                setAttr={setLocalAttr}
                setShowModal={setShowModal}
                errors={errors}
                setErrors={setErrors}
              />
            ) : (
              <PreviewAttribute attr={localAttr} />
            )}
          </Box>
        </Box>
      </Box>
    );
  }
};

export default CreateAttribute;
