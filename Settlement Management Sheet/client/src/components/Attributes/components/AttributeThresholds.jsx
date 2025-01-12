import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import confetti from 'canvas-confetti';
import {
  Box,
  Autocomplete,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
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

const AttributeThresholds = ({ attr, setAttr, errors, setErrors }) => {
  const [placeholders, setPlaceholders] = useState(placeholderArray);
  const [showTooltip, setShowTooltip] = useState(false);
  const { showSnackbar } = useSnackbar();

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
      const updatedAttr = { ...attr };

      // Clone the array to avoid direct mutation
      const thresholdsClone = [...updatedAttr.thresholds];

      // Find the threshold by temp-id
      const index = thresholdsClone.findIndex((thresh) => thresh.id === tempId);

      if (thresholdsClone[index].max === value) {
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
      updatedAttr.thresholds = thresholdsClone;
      setAttr(updatedAttr);
    },
    [attr, setAttr]
  ); // Dependencies for useCallback

  const handleThresholdNameChange = (value, id) => {
    const updatedAttr = { ...attr };
    const index = updatedAttr.thresholds.findIndex(
      (thresh) => thresh.id === id
    );
    const updatedThresholds = [...updatedAttr.thresholds];
    updatedThresholds[index] = {
      ...updatedAttr.thresholds[index],
      name: value,
    };
    updatedAttr.thresholds = updatedThresholds;
    setAttr(updatedAttr);
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

  const redistributePlaceholders = (thresholds) => {
    const totalPlaceholders = placeholders.length; // Default 7
    const remainingCount = thresholds.length;

    // Always include the first and last placeholders
    const extremes = [placeholders[0], placeholders[totalPlaceholders - 1]];

    if (remainingCount === 1) return [extremes[0]]; // Single threshold edge case

    // Calculate proportional indices for placeholders
    const step = (totalPlaceholders - 1) / (remainingCount - 1);
    const distributedPlaceholders = thresholds.map((_, index) => {
      const placeholderIndex = Math.round(index * step);
      return placeholders[placeholderIndex] || extremes[1];
    });

    return distributedPlaceholders;
  };

  const updateThresholdsWithPlaceholders = (thresholds) => {
    const distributedPlaceholders = redistributePlaceholders(thresholds);

    return thresholds.map((threshold, index) => ({
      ...threshold,
      placeholder: distributedPlaceholders[index], // Attach placeholder to threshold
    }));
  };

  const handleRemove = (id) => {
    const updatedAttr = { ...attr };
    updatedAttr.thresholds = updatedAttr.thresholds.filter(
      (threshold) => threshold.id !== id
    );

    const updatedPlaceholders = redistributePlaceholders(
      updatedAttr.thresholds
    );
    setPlaceholders(updatedPlaceholders);
    updatedAttr.thresholds = updateThresholdsWithPlaceholders(
      updatedAttr.thresholds
    );
    setAttr(updatedAttr);
  };

  const handleAdd = () => {
    if (attr.thresholds.length >= 100) {
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
    const updatedAttr = { ...attr };
    updatedAttr.thresholds = [
      ...updatedAttr.thresholds,
      {
        id: Date.now(),
        name: '',
        max: recommendThresholdValue(attr.thresholds),
      },
    ];
    updatedAttr.thresholds.sort((a, b) => a.max - b.max);
    const updatedPlaceholders = redistributePlaceholders(
      updatedAttr.thresholds
    );
    setPlaceholders(updatedPlaceholders);
    updatedAttr.thresholds = updateThresholdsWithPlaceholders(
      updatedAttr.thresholds
    );
    setAttr(updatedAttr);
  };

  const handleValidationUpdate = (value, id) => {
    const updatedAttr = { ...errors };
    const index = updatedAttr?.thresholds?.findIndex(
      (thresh) => thresh.id === id
    );
    if (!index) {
      return;
    }
    const updatedThresholds = [...updatedAttr.thresholds];
    updatedThresholds[index] = {
      ...updatedAttr.thresholds[index],
      max: value,
    };
    updatedAttr.thresholds = updatedThresholds;
    setErrors(updatedAttr);
  };

  const handleNameValidation = (value, id) => {
    const updatedAttr = { ...errors };
    console.log(id);
    console.log(updatedAttr);
    const index = updatedAttr?.thresholds?.findIndex(
      (thresh) => thresh.id === id
    );
    if (index === -1) {
      return;
    }
    const updatedThresholds = [...updatedAttr.thresholds];
    updatedThresholds[index] = {
      ...updatedAttr.thresholds[index],
      name: value,
    };
    updatedAttr.thresholds = updatedThresholds;
    console.log(errors);
    console.log(updatedAttr);
    setErrors(updatedAttr);
  };

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
      {(attr.thresholds || []).map((threshold, index) => (
        <Box
          key={threshold.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 12,
            transition: 'top 0.3s ease, left 0.3s ease',
            gap: 2,
          }}
        >
          <DynamicForm
            initialValues={{ name: attr.thresholds[index].name }}
            field={{
              name: 'name',
              type: 'text',
              value: threshold.name || '',
              textSx: { width: '100%' },
              placeholder: placeholders[index],
              validate: (value) => {
                if (value.length < 3) {
                  return 'Name must be longer than 3 characters';
                }
                return null;
              },
              id: threshold.id,
            }}
            shrink={true}
            boxSx={{ width: '80%' }}
            externalUpdate={handleThresholdNameChange}
            parentError={
              errors?.thresholds?.length
                ? errors?.thresholds?.[index]?.name
                : null
            }
            onError={handleNameValidation}
            id={threshold.id}
          />
          <DynamicForm
            initialValues={{ max: threshold.max }}
            field={{
              name: 'max',
              label: 'Value',
              value: threshold.max,
              type: 'number',
              textSx: { width: '100%' },
              validate: (value) => {
                if (value < 0 || value > 100) {
                  return 'Value must be between 0 and 100';
                }
                return null;
              },
              id: threshold.id,
            }}
            boxSx={{ width: '66%' }}
            shrink={true}
            externalUpdate={handleThresholdMaxChange}
            parentError={errors.thresholds?.[index]?.max || null}
            onError={handleValidationUpdate}
            min={0}
          />
          <Tooltip title="Remove threshold">
            <Button
              variant="contained"
              aria-label="Remove threshold"
              onClick={() => handleRemove(threshold.id)}
              sx={{ px: 4 }}
            >
              Remove
            </Button>
          </Tooltip>
        </Box>
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
