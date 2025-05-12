import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import { Box, Button, Tooltip, Typography } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { getErrorCount } from 'features/validation/validationSlice.js';

import ChecklistItem from './ChecklistItem.jsx';
import countValidEntries from './countValidEntries.js';
import calculateProgressColor from './calculateProgressColor.js';

const ValidationChecklist = ({
  defaultExpand,
  checklistContent,
  errors,
  tool,
  ...props
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpand || false);
  const [errorStates, setErrorStates] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  // progress bar stuff
  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState(
    'linear-gradient(to right, #4caf50 0%, #f44336 0%)'
  );
  const successColor = theme.palette.success.main;
  const errorColor = theme.palette.error.main;

  useEffect(() => {
    defaultExpand === true && setExpanded(true);
  }, [defaultExpand]);

  useEffect(() => {
    setErrorCount(getErrorCount(errors));
  }, [errors]);

  useEffect(() => {
    if (errors && checklistContent) {
      let totalValid = 0;
      let grandTotal = 0;

      const newErrorStates = checklistContent.map((item) => {
        const configuredItem = { ...item, type: item.type || 'single' };
        const data = get(errors, item.keypath);
        console.log('data', data);

        if (item.type === 'group' && data !== undefined) {
          const { valid, total } = countValidEntries(data);
          configuredItem.valid = valid;
          configuredItem.total = total;
          totalValid += valid;
          grandTotal += total;
        } else {
          grandTotal += 1;
          data === null ? (totalValid += 1) : null;
        }

        configuredItem.error = data;
        return configuredItem;
      });

      setErrorStates(newErrorStates);
      const { progress, color } = calculateProgressColor(
        totalValid,
        grandTotal,
        successColor,
        errorColor
      );
      setProgress(progress);
      setProgressColor(color);
    }
  }, [errors, checklistContent, successColor, errorColor]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: expanded ? 0 : '-318px', // Move out of view when collapsed
        width: '300px',
        height: '100%',
        backgroundColor: 'background.default',
        boxShadow: 4,
        borderRadius: '8px 0 0 8px', // Rounded edge only on the left
        transition: 'right 0.4s ease-in-out',
        zIndex: 1000,
      }}
    >
      {/* Tab / Button */}
      <Tooltip
        title={expanded ? null : `${errorCount} Errors Remaining`}
        placement="left"
        arrow
      >
        <Button
          onClick={toggleExpand}
          sx={{
            position: 'absolute',
            top: '50%', // Center vertically
            left: '-64px', // Place just outside the card
            width: '48px',
            height: '48px',
            backgroundColor: 'primary.main',
            borderRadius: '8px 0 0 8px ', // Rounded edge on the left
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)', // Slight hover effect
            },
            borderBottom: `4px solid`,
            borderImage: progressColor,
            borderImageSlice: 1,
          }}
        >
          {expanded ? (
            <ArrowRightIcon
              sx={{ color: 'primary.contrastText', fontSize: 36 }}
            />
          ) : (
            <ArrowLeftIcon
              sx={{ color: 'primary.contrastText', fontSize: 36 }}
            />
          )}
        </Button>
      </Tooltip>

      {/* Card Content */}
      <Box
        sx={{
          padding: 2,
          overflow: 'auto',
          backgroundColor: 'background.paper',
          boxShadow: 4,
          borderRadius: '0 0 8px 8px', // Rounded edge only on the bottom
        }}
      >
        <Typography variant="h5">{errorCount} Errors</Typography>
        <Typography variant="body1">
          {errorCount
            ? 'Please address the following issues:'
            : "No errors found. You're good to go!"}
        </Typography>
        {errorStates.map((item, index) => (
          <ChecklistItem
            key={index}
            label={
              item.type === 'group'
                ? `${item.label} (${item.valid} / ${item.total})`
                : item.label
            }
            error={item.type === 'group' ? item.valid < item.total : item.error}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ValidationChecklist;
