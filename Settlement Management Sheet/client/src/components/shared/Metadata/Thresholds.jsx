import React, { useCallback, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import confetti from 'canvas-confetti';
import { useTools } from 'hooks/useTool.tsx';
import { useSnackbar } from 'context/SnackbarContext.jsx';

import { v4 as newId } from 'uuid';
import resolveDuplicates from 'utility/resolveDuplicates';

import { Box, Typography, Tooltip, Button } from '@mui/material';
import Threshold from './Threshold';

const ObjectThresholds = ({ tool, max = 21, id }) => {
  const {
    edit,
    updateTool,
    validateToolField,
    errors: threshErrors,
  } = useTools(tool, id);
  const thresholds = edit.thresholds;
  const [showTooltip, setShowTooltip] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [lastId, setLastId] = useState(null);

  const errors = threshErrors.thresholds.data;

  const debouncedShowSnackbar = useCallback(
    debounce(
      (message, severity) => {
        showSnackbar(message, severity);
      },
      300,
      { leading: true, trailing: false }
    ),
    [showSnackbar]
  );

  const handleThresholdMaxChange = useCallback(
    (updates, { id }) => {
      updateTool(`thresholds.data.${id}.max`, updates);
      if (lastId !== id) {
        setLastId(id);
      }
      validateToolField(`thresholds.data.${id}.max`, updates);
    },
    [updateTool, validateToolField, lastId, setLastId]
  );

  const handleBlur = useCallback(() => {
    const { thresholdsClone, changes } = resolveDuplicates(
      thresholds.data,
      lastId
    );

    const newOrder = [...thresholds.order].sort((a, b) => {
      return thresholdsClone[a].max - thresholdsClone[b].max;
    });
    updateTool('thresholds.data', thresholdsClone);
    updateTool('thresholds.order', newOrder);
    if (changes) {
      changes.forEach((change) => {
        debouncedShowSnackbar(change, 'warning');
      });
    }
  }, [
    thresholds.data,
    thresholds.order,
    updateTool,
    lastId,
    debouncedShowSnackbar,
  ]);

  const handleThresholdNameChange = (updates, { id }) => {
    updateTool(`thresholds.data.${id}.name`, updates);
    validateToolField(`thresholds.data.${id}.name`, updates);
  };

  const recommendThresholdValue = (thresholds) => {
    if (thresholds.length === 0) {
      return 33; // Default starting value
    }

    // Sort thresholds by max value
    const sortedThresholds = thresholds.order
      .map((id) => thresholds.data[id])
      .sort((a, b) => a.max - b.max);

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

  const handleRemove = useCallback(
    (id) => {
      let updatedThresholds = { ...thresholds.data };
      delete updatedThresholds[id];
      updateTool('thresholds.data', updatedThresholds);

      const order = thresholds.order;
      const newOrder = order.filter((item) => item !== id);
      updateTool('thresholds.order', newOrder);

      // Remove the error from the store
      const newErrors = { ...errors };
      delete newErrors[id];
      validateToolField('thresholds.errors', newErrors);
    },
    [thresholds.data, errors]
  );

  const handleAdd = () => {
    if (thresholds.order.length >= max) {
      showSnackbar(
        `Congrats on clicking at least ${max - 7} times! ${max} is the limit, friend. Hope that's enough!`,
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
    let updatedThresholds = { ...thresholds.data };
    const id = newId();
    updatedThresholds[id] = {
      id,
      name: '',
      max: recommendThresholdValue(thresholds),
    };
    const newOrder = [...thresholds.order, id];
    newOrder.sort(
      (a, b) => updatedThresholds[a].max - updatedThresholds[b].max
    );
    updateTool('thresholds.order', newOrder);
    updateTool('thresholds.data', updatedThresholds);

    validateToolField(`thresholds.data.${id}`, {
      name: 'Threshold name must be at least 3 characters',
      max: null,
    });
  };

  const handleMaxValidation = useCallback((value, { id }) => {
    validateToolField(`thresholds.${id}.max`, value);
  });

  const handleNameValidation = useCallback((value, { id }) => {
    validateToolField(`thresholds.${id}.name`, value);
  });

  return (
    <Box>
      <Typography variant="h6">
        {tool.charAt(0).toUpperCase() + tool.slice(1)} Thresholds
      </Typography>
      <Typography>
        Thresholds represent {tool} state at a given percentage. They provide
        both narrative depth and an easy way to set{' '}
        <strong>Conditions and Listeners</strong> without relying on intimate
        knowledge of the {tool} itself.{' '}
      </Typography>
      {thresholds.order.map((tId, index) => {
        const threshold = thresholds.data[tId];
        return (
          <Threshold
            key={tId}
            threshold={threshold}
            errors={errors[tId]}
            index={index}
            handleNameChange={handleThresholdNameChange}
            handleMaxChange={handleThresholdMaxChange}
            handleMaxValidation={handleMaxValidation}
            handleNameValidation={handleNameValidation}
            handleRemove={handleRemove}
            handleBalanceChange={handleBlur}
            id={tId}
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

export default ObjectThresholds;
