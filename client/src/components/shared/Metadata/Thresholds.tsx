import React, { useCallback, useState, useContext } from 'react';
import { debounce } from 'lodash';
import confetti from 'canvas-confetti';
import { useTools } from 'hooks/tools/useTools.jsx';
import { ShellContext } from '@/context/ShellContext.js';
import { SnackbarType } from '@/app/types/SnackbarTypes.js';

import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { useDispatch } from 'react-redux';

import { ulid as newId } from 'ulid';
import resolveDuplicates from '@/features/Attributes/helpers/resolveDuplicates.js';

import { Box, Typography, Tooltip, Button } from '@mui/material';
import Threshold from './Threshold.jsx';
import { Thresholds } from 'types/common.js';
import useOrderedData from '@/hooks/utility/useOrderedData.js';
import { AppDispatch } from '@/app/store.js';

const ObjectThresholds = ({ max = 21 }) => {
  const dispatch: AppDispatch = useDispatch();
  const { tool, id } = useContext(ShellContext);
  const { data, order, errors, add, remove, reorder } = useOrderedData(
    tool,
    id,
    'thresholds'
  );
  const { edit, updateTool } = useTools(tool, id);
  const thresholds = edit.thresholds;
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastId, setLastId] = useState(null);

  const debouncedShowSnackbar = useCallback(
    debounce(
      (message: string, type: SnackbarType) => {
        dispatch(showSnackbar({ message, type }));
      },
      300,
      { leading: true, trailing: false }
    ),
    [showSnackbar, dispatch]
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
      changes.forEach((change: any) => {
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

  const recommendThresholdValue = (thresholds: Thresholds) => {
    if (thresholds.order.length === 0) {
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
    (id: string) => {
      remove(id);
    },
    [remove]
  );

  const handleAdd = () => {
    if (thresholds.order.length >= max) {
      dispatch(
        showSnackbar({
          message: `I hope 21 is enough! Scaling UIs is hard!`,
          type: 'info',
        })
      );
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowTooltip(true);
      return;
    }
    const id = newId();
    const entry = {
      id,
      name: '',
      max: recommendThresholdValue(thresholds), // Default max for first threshold
    };
    add({ id, entry, sort: true });
  };

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
      {thresholds.order.map((tId: string) => {
        return (
          <Threshold
            handleRemove={
              thresholds.order.length > 2 ? handleRemove : undefined
            }
            handleBlur={handleBlur}
            id={tId}
            key={tId}
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
