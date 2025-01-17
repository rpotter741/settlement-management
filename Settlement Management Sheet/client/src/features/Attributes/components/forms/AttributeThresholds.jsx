import React, { useCallback, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import confetti from 'canvas-confetti';
import { useAttribute } from '../../hooks/useEditAttribute.jsx';
import { useSnackbar } from '../../../../context/SnackbarContext.jsx';

import { v4 as newId } from 'uuid';
import resolveDuplicates from '../../helpers/resolveDuplicates';

import { Box, Typography, Tooltip, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Threshold from './Threshold';

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
  const { thresholds, updateAttribute, validateAttributeField } =
    useAttribute();
  const [placeholders, setPlaceholders] = useState(placeholderArray);
  const [showTooltip, setShowTooltip] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [lastId, setLastId] = useState(null);
  const errors = thresholds.errors;

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
    (value, { id }) => {
      const thresholdsClone = { ...thresholds.data };
      if (thresholdsClone[id].max === value) {
        return;
      }
      updateAttribute(`thresholds.${id}.max`, value);
      if (lastId !== id) {
        setLastId(id);
      }
    },
    [thresholds.data, updateAttribute, lastId, setLastId]
  );

  const handleBlur = useCallback(() => {
    const { thresholdsClone, changes } = resolveDuplicates(
      thresholds.data,
      lastId
    );

    const newOrder = [...thresholds.order].sort((a, b) => {
      return thresholdsClone[a].max - thresholdsClone[b].max;
    });
    updateAttribute('thresholds', thresholdsClone);
    updateAttribute('thresholdsOrder', newOrder);
    if (changes) {
      changes.forEach((change) => {
        debouncedShowSnackbar(change, 'warning');
      });
    }
  }, [
    thresholds.data,
    thresholds.order,
    updateAttribute,
    lastId,
    debouncedShowSnackbar,
  ]);

  const handleThresholdNameChange = (value, { id }) => {
    updateAttribute(`thresholds.${id}.name`, value);
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

  const handleRemove = useCallback(
    (id) => {
      let updatedThresholds = { ...thresholds };
      delete updatedThresholds[id];
      updateAttribute('thresholds', updatedThresholds);

      const order = thresholds.order;
      const newOrder = order.filter((item) => item !== id);
      updateAttribute('thresholdsOrder', newOrder);

      // const updatedPlaceholders = redistributePlaceholders(thresholds);
      // setPlaceholders(updatedPlaceholders);
      // updatedThresholds = updateThresholdsWithPlaceholders(updatedThresholds);

      // Remove the error from the store
      const newErrors = { ...errors };
      delete newErrors[id];
      validateAttributeField('thresholds', newErrors);
    },
    [thresholds.data, errors]
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
    let updatedThresholds = { ...thresholds };
    const id = newId();
    updatedThresholds[id] = {
      id,
      name: '',
      max: recommendThresholdValue(thresholds),
    };
    // const updatedPlaceholders = redistributePlaceholders(updatedThresholds);
    // setPlaceholders(updatedPlaceholders);
    // updatedThresholds = updateThresholdsWithPlaceholders(updatedThresholds);

    updateAttribute('thresholds', updatedThresholds);

    validateAttributeField(`thresholds.${id}`, {
      name: 'Threshold name must be at least 3 characters.',
      max: 'Threshold max must be between 1 and 100.',
    });
  };

  const handleMaxValidation = useCallback((value, { id }) => {
    validateAttributeField(`thresholds.${id}.max`, value);
  });

  const handleNameValidation = useCallback((value, { id }) => {
    validateAttributeField(`thresholds.${id}.name`, value);
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
      {thresholds.order.map((id, index) => {
        const threshold = thresholds.data[id];
        return (
          <Threshold
            key={id}
            threshold={threshold}
            errors={errors[id]}
            index={index}
            handleNameChange={handleThresholdNameChange}
            handleMaxChange={handleThresholdMaxChange}
            handleMaxValidation={handleMaxValidation}
            handleNameValidation={handleNameValidation}
            handleRemove={handleRemove}
            handleBalanceChange={handleBlur}
            id={id}
            // placeholder={placeholders[index]}
          />
        );
      })}
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
