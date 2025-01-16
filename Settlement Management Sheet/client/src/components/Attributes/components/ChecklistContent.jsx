import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAttribute } from '../../../features/attribute/attributeSlice';

import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

const fieldLabelMap = {
  name: 'Attribute Name',
  description: 'Description',
  costPerLevel: 'Cost Per Level',
  healthPerLevel: 'Health Per Level',
  values: 'Values',
  thresholds: 'Thresholds',
  settlementPointCost: 'Settlement Types',
  // Add other fields here
};

const countValidEntries = (items) => {
  if (!Array.isArray(items)) return { valid: 0, total: 0 };

  const total = items.length;
  const valid = items.filter((item) =>
    Object.entries(item).every(([key, value]) => {
      if (key === 'id') return true; // Skip the 'id' field in validation
      return value === null; // Consider fields valid if they're not null
    })
  ).length;

  return { valid, total }; // Return correct valid and total counts
};

const renderValidationList = (errors) => {
  // Filter out fields that need granular handling
  const filteredKeys = Object.keys(errors).filter(
    (key) =>
      key !== 'thresholds' &&
      key !== 'settlementPointCost' &&
      key !== 'id' &&
      key !== 'icon' &&
      key !== 'tags' &&
      key !== 'iconColor'
  );

  // Render regular fields
  const regularFields = filteredKeys.map((key) => {
    let error = errors[key];
    let label = fieldLabelMap[key] || key; // Default to the key if no label exists
    if (label === 'Values') {
      label = 'Max Per Level';
      error = errors.values.maxPerLevel;
    }
    const icon = error ? (
      <WarningIcon color="error" />
    ) : (
      <CheckIcon color="success" />
    );
    return (
      <Box
        key={key}
        sx={{
          display: 'flex',
          alignItems: 'start',
          gap: 2,
          mb: 1,
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon}
          <Typography
            noWrap
            sx={{
              textOverflow: 'hidden',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <strong>{label}</strong>
          </Typography>
        </Box>
      </Box>
    );
  });

  return [...regularFields];
};

const ChecklistContent = ({ errorCount, defaultExpand }) => {
  const errors = useSelector((state) => state.validation.attribute);
  const [thresholdErrors, setThresholdErrors] = useState({});
  const [settlementPointErrors, setSettlementPointErrors] = useState({});
  const [expanded, setExpanded] = useState(defaultExpand);

  useEffect(() => {
    if (!errors) return;
    const newThresholdErrors = countValidEntries(errors?.thresholds);
    setThresholdErrors(newThresholdErrors);
    const newSettlementPointErrors = countValidEntries(
      errors?.settlementPointCost
    );
    setSettlementPointErrors(newSettlementPointErrors);
  }, [errors?.thresholds, errors?.settlementPointCost, errors]);

  useEffect(() => {
    defaultExpand === true && setExpanded(true);
  }, [defaultExpand]);

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
        backgroundColor: 'background.paper',
        boxShadow: 4,
        borderRadius: '8px 0 0 8px', // Rounded edge only on the left
        transition: 'right 0.4s ease-in-out',
        zIndex: 1000,
      }}
    >
      {/* Tab / Button */}
      <Tooltip
        title={
          expanded
            ? 'Collapse Validation Checklist'
            : 'Expand Validation Checklist'
        }
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
        <Typography variant="body2">
          Fix the following fields to proceed:
        </Typography>
        {errors && renderValidationList(errors)}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          {settlementPointErrors.valid < settlementPointErrors.total ? (
            <WarningIcon color="error" />
          ) : (
            <CheckIcon color="success" />
          )}

          <Typography
            noWrap
            sx={{
              textOverflow: 'hidden',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <strong>{`Settlement Point Costs (${settlementPointErrors.valid}/${settlementPointErrors.total})`}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          {thresholdErrors.valid < thresholdErrors.total ? (
            <WarningIcon color="error" />
          ) : (
            <CheckIcon color="success" />
          )}

          <Typography
            noWrap
            sx={{
              textOverflow: 'hidden',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <strong>{`Thresholds (${thresholdErrors.valid}/${thresholdErrors.total})`}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChecklistContent;
