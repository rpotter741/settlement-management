import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAttrValues,
  selectAttrValuesErrors,
} from '../../../features/validation/selectors/attributeSelectors';
import autobalanceSteps from '../../../helpers/attributes/attributeAutoBalance.js';

import { attributeFields } from '../../../helpers/attributes/attributeFormData';

import { updateEditAttribute } from '../../../features/attribute/attributeSlice';
import { validateField } from '../../../features/validation/validationSlice';

import {
  Box,
  Typography,
  Tooltip,
  FormControl,
  Switch,
  FormLabel,
} from '@mui/material';
import DynamicForm from '../../utils/DynamicForm/DynamicForm';
import InfoIcon from '@mui/icons-material/Info';

const AttrValues = ({ values }) => {
  const [autobalance, setAutobalance] = useState(false);

  const attr = useSelector(selectAttrValues);
  const errors = useSelector(selectAttrValuesErrors);

  const dispatch = useDispatch();

  const handleUpdate = (updates, { keypath }) => {
    dispatch(updateEditAttribute({ keypath, updates }));
  };

  const handleValidationUpdate = (error, { keypath }) => {
    dispatch(validateField({ tool: 'attribute', error, keypath }));
  };

  const handleAutobalanceChange = ({ field, value, values, setValues }) => {
    if (field === 'costPerLevel' || 'maxPerLevel') {
      const stepMap = autobalanceSteps[field];
      if (!stepMap) {
        return;
      }
      const closestStep = Object.keys(stepMap).reduce((closest, current) => {
        return Math.abs(current - value) < Math.abs(closest - value)
          ? current
          : closest;
      }, Object.keys(stepMap)[0]);

      if (field === 'costPerLevel') {
        setValues({
          ...values,
          costPerLevel: value, // User input
          ...stepMap[closestStep], // Adjust related fields
        });
      }
      if (field === 'maxPerLevel') {
        setValues({
          ...values,
          maxPerLevel: value,
          ...stepMap[closestStep],
        });
      }
    }
  };

  return (
    <Box>
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          gridColumn: 'span 3',
        }}
      >
        <FormLabel sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography>Autobalance</Typography>
          <Tooltip title="Automatically adjust related values to maintain a balanced configuration.">
            <InfoIcon
              sx={{
                fontSize: 18,
                color: 'text.secondary',
                cursor: 'pointer',
              }}
            />
          </Tooltip>
        </FormLabel>
        <Switch
          checked={autobalance}
          onChange={(e) => setAutobalance(e.target.checked)}
        />
      </FormControl>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
          gridTemplateRows: 'auto',
          alignItems: 'start',
          justifyContent: 'center',
          my: 2,
          gap: 2,
          backgroundColor: 'background.paper',
          width: '100%',
          position: 'relative',
          gridColumn: 'span 3',
        }}
      >
        <DynamicForm
          initialValues={{ maxPerLevel: attr.maxPerLevel || 0 }}
          validate={attributeFields.maxPerLevel.validate}
          field={attributeFields.maxPerLevel}
          externalUpdate={handleUpdate}
          shrink
          parentError={errors.maxPerLevel}
          onError={handleValidationUpdate}
          isExpanded={values}
        />
        <DynamicForm
          initialValues={{ healthPerLevel: attr?.healthPerLevel || 0 }}
          validate={attributeFields.healthPerLevel.validate}
          field={attributeFields.healthPerLevel}
          externalUpdate={handleUpdate}
          shrink
          parentError={errors.healthPerLevel}
          onError={handleValidationUpdate}
          isExpanded={values}
        />
        <DynamicForm
          initialValues={{ costPerLevel: attr?.costPerLevel || 0 }}
          validate={attributeFields.costPerLevel.validate}
          field={attributeFields.costPerLevel}
          externalUpdate={handleUpdate}
          shrink
          parentError={errors.costPerLevel}
          onError={handleValidationUpdate}
          isExpanded={values}
        />
      </Box>
    </Box>
  );
};

export default AttrValues;
