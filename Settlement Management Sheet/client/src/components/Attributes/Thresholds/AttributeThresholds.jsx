import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as newId } from 'uuid';

import Threshold from './Threshold';

import {
  updateEditAttribute,
  deleteEditIndex,
} from '../../../features/attribute/attributeSlice.js';
import {
  validateField,
  setErrorField,
} from '../../../features/validation/validationSlice';

import debounce from 'lodash/debounce';
import confetti from 'canvas-confetti';
import { Box, Typography, Tooltip, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useSnackbar } from '../../../context/SnackbarContext';
import DynamicForm from '../../utils/DynamicForm/DynamicForm';

const placeholderArray = [
  'Starving',
  'Malnourished',
  'Hungry',
  'Satiated',
  'Nourished',
  'Well-Fed',
  'Feasting',
];

const AttributeThresholds = () => {
  const [placeholders, setPlaceholders] = useState(placeholderArray);
  const [showTooltip, setShowTooltip] = useState(false);
  const { showSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const thresholds = useSelector((state) => state.attributes.edit.thresholds);
  const errors = useSelector((state) => state.validation.attribute.thresholds);

  useEffect(() => {
    console.log(thresholds);
  }, [thresholds]);

  const debouncedShowSnackbar = useCallback(
    debounce(
      (message, severity) => {
        showSnackbar(message, severity);
      },
      300,
      { leading: true, trailing: false }
    ), // Debounce time (300ms here)
    [showSnackbar] // Dependency for useCallback
  );

  const handleThresholdMaxChange = useCallback(
    (value, tempId) => {
      const thresholdsClone = [...thresholds];

      // Find the threshold by temp-id
      const index = thresholdsClone.findIndex((thresh) => thresh.id === tempId);

      if (thresholdsClone[index]?.max === value) {
        return;
      }

      // Check for duplicates
      const duplicate = thresholdsClone.find(
        (threshold, i) => threshold.max === value && i !== index
      );

      if (duplicate) {
        console.log('Duplicate detected');
        // Calculate minimal adjustment
        const diffs = thresholdsClone.map((thresh) => thresh.max - value);
        const diffUp = Math.min(...diffs.filter((d) => d > 0), Infinity); // Smallest positive difference
        const diffDown = Math.max(...diffs.filter((d) => d < 0), -Infinity); // Largest negative difference

        // Decide whether to move up or down
        const adjustUp = Math.abs(diffUp) <= Math.abs(diffDown);
        let newValue = adjustUp ? value + 1 : value - 1;

        // Ensure the adjusted value is unique
        while (thresholdsClone.some((thresh) => thresh.max === newValue)) {
          newValue = adjustUp ? newValue + 1 : newValue - 1;
        }

        adjustUp ? newValue-- : newValue++;
        // Clamp the value between 0 and 100
        newValue = Math.max(0, Math.min(100, newValue));

        // Show a notification (debounced version to be added)
        debouncedShowSnackbar(
          `Threshold adjusted to ${newValue} to avoid duplicate values.`,
          'warning'
        );

        // Apply the adjusted value
        thresholdsClone[index] = {
          ...thresholdsClone[index],
          max: newValue,
        };
      } else {
        // No conflict, update the value directly
        thresholdsClone[index] = {
          ...thresholdsClone[index],
          max: Math.max(0, Math.min(100, value)), // Clamp the value,
        };
      }

      thresholdsClone.sort((a, b) => a.max - b.max);

      // Update the state
      dispatch(
        updateEditAttribute({ keypath: 'thresholds', updates: thresholdsClone })
      );
    },
    [thresholds]
  ); // Dependencies for useCallback

  const handleThresholdNameChange = (value, { keypath }) => {
    dispatch(updateEditAttribute({ updates: value, keypath }));
  };

  const recommendThresholdValue = (thresholds) => {
    if (thresholds.length === 0) {
      return 33; // Default starting value
    }

    // Sort thresholds by max value
    const sortedThresholds = [...thresholds].sort((a, b) => a.max - b.max);

    // Find the largest gap between consecutive thresholds
    let largestGap = 0;
    let recommendedValue = 0;

    for (let i = 0; i < sortedThresholds.length - 1; i++) {
      const gap = sortedThresholds[i + 1].max - sortedThresholds[i].max;
      if (gap > largestGap) {
        largestGap = gap;
        recommendedValue = Math.floor(
          (sortedThresholds[i + 1].max + sortedThresholds[i].max) / 2
        ); // Midpoint of the gap
      }
    }

    // Check gaps at the start and end of the range
    if (sortedThresholds[0].max > largestGap) {
      largestGap = sortedThresholds[0].max;
      recommendedValue = Math.floor(sortedThresholds[0].max / 2); // Midpoint to 0
    }

    const upperLimitGap =
      100 - sortedThresholds[sortedThresholds.length - 1].max;
    if (upperLimitGap > largestGap) {
      largestGap = upperLimitGap;
      recommendedValue = Math.floor(
        (100 + sortedThresholds[sortedThresholds.length - 1].max) / 2
      ); // Midpoint to 100
    }

    return recommendedValue;
  };

  // const redistributePlaceholders = (thresholds) => {
  //   const totalPlaceholders = placeholders.length; // Default 7
  //   const remainingCount = thresholds.length;

  //   // Always include the first and last placeholders
  //   const extremes = [placeholders[0], placeholders[totalPlaceholders - 1]];

  //   if (remainingCount === 1) return [extremes[0]]; // Single threshold edge case

  //   // Calculate proportional indices for placeholders
  //   const step = (totalPlaceholders - 1) / (remainingCount - 1);
  //   const distributedPlaceholders = thresholds.map((_, index) => {
  //     const placeholderIndex = Math.round(index * step);
  //     return placeholders[placeholderIndex] || extremes[1];
  //   });

  //   return distributedPlaceholders;
  // };

  // const updateThresholdsWithPlaceholders = (thresholds) => {
  //   const distributedPlaceholders = redistributePlaceholders(thresholds);

  //   return thresholds.map((threshold, index) => ({
  //     ...threshold,
  //     placeholder: distributedPlaceholders[index], // Attach placeholder to threshold
  //   }));
  // };

  const handleRemove = useCallback(
    (id) => {
      let updatedThresholds = [...thresholds].filter(
        (threshold) => threshold.id !== id
      );

      // const updatedPlaceholders = redistributePlaceholders(thresholds);
      // setPlaceholders(updatedPlaceholders);
      // updatedThresholds = updateThresholdsWithPlaceholders(updatedThresholds);
      dispatch(
        updateEditAttribute({
          keypath: 'thresholds',
          updates: updatedThresholds,
        })
      );

      // Remove the error from the store
      const newErrors = [...errors].filter((threshold) => threshold.id !== id);
      dispatch(
        setErrorField({
          tool: 'attribute',
          keypath: 'thresholds',
          value: newErrors,
        })
      );
    },
    [thresholds, errors]
  );

  const handleAdd = () => {
    if (thresholds.length >= 100) {
      showSnackbar(
        "Congrats on clicking at least 94 times! 100 is the limit, friend. Hope that's enough!",
        'info'
      );
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowTooltip(true);
      return;
    }
    let updatedThresholds = [...thresholds];
    const id = newId();
    updatedThresholds.push({
      id,
      name: '',
      max: recommendThresholdValue(thresholds),
    });
    updatedThresholds.sort((a, b) => a.max - b.max);
    // const updatedPlaceholders = redistributePlaceholders(updatedThresholds);
    // setPlaceholders(updatedPlaceholders);
    // updatedThresholds = updateThresholdsWithPlaceholders(updatedThresholds);
    dispatch(
      updateEditAttribute({
        keypath: 'thresholds',
        updates: updatedThresholds,
      })
    );
    const index = updatedThresholds.findIndex((thresh) => thresh.id === id);

    const newErrors = [...errors];

    newErrors.splice(index, 0, {
      name: 'Threshold name is required.',
      max: null,
      id,
    });
    dispatch(
      setErrorField({
        tool: 'attribute',
        keypath: 'thresholds',
        value: newErrors,
      })
    );
  };

  const handleMaxValidation = useCallback((value, { id }) => {
    dispatch(
      validateField({
        tool: 'attribute',
        error: value,
        keypath: 'thresholds',
        id,
        field: 'max',
      })
    );
  });

  const handleNameValidation = useCallback((value, { id }) => {
    dispatch(
      validateField({
        tool: 'attribute',
        error: value,
        keypath: 'thresholds',
        id,
        field: 'name',
      })
    );
  });

  return (
    <Box>
      <Typography variant="h6">
        Attribute Thresholds
        <Tooltip
          title="The placeholder in each threshold you place (to a maximum of 7) will represent the Food Attribute thresholds to give you an idea of how they could scale."
          arrow
        >
          <InfoIcon />
        </Tooltip>
      </Typography>
      <Typography>
        Thresholds represent the state of an attribute at a given percentage.
        They provide both narrative depth and an easy way to set{' '}
        <strong>Conditions and Listeners</strong> without relying on intimate
        knowledge of the attribute itself.{' '}
      </Typography>
      {(thresholds || []).map((threshold, index) => (
        <Threshold
          key={threshold.id}
          threshold={threshold}
          errors={errors[index]}
          index={index}
          handleNameChange={handleThresholdNameChange}
          handleMaxChange={handleThresholdMaxChange}
          handleMaxValidation={handleMaxValidation}
          handleNameValidation={handleNameValidation}
          handleRemove={handleRemove}
          // placeholder={placeholders[index]}
        />
      ))}
      {showTooltip ? (
        <Tooltip title="Back for more? That's what we love about you!">
          <Button
            variant="contained"
            color="success"
            aria-label="Add threshold"
            onClick={handleAdd}
            sx={{ px: 4 }}
          >
            Add Threshold
          </Button>
        </Tooltip>
      ) : (
        <Button
          variant="contained"
          color="success"
          aria-label="Add threshold"
          onClick={handleAdd}
          sx={{ px: 4 }}
        >
          Add Threshold
        </Button>
      )}
    </Box>
  );
};

export default AttributeThresholds;
