import React, { useState } from 'react';
import { useTools } from 'hooks/useTool.tsx';
import autobalanceSteps from '../../helpers/attributeAutoBalance.js';
import { attributeFields } from '../../helpers/attributeFormData';

import {
  Box,
  Typography,
  Tooltip,
  FormControl,
  Switch,
  FormLabel,
} from '@mui/material';
import { DynamicForm } from '../../../../components/index.js';
import InfoIcon from '@mui/icons-material/Info';

const AttrValues = ({ values, id, columns }) => {
  const {
    edit,
    updateTool: updateAttribute,
    validateToolField: validateAttributeField,
    errors,
  } = useTools('attribute', id);

  const [autobalance, setAutobalance] = useState(false);

  const handleUpdate = (updates, { keypath }) => {
    updateAttribute(keypath, updates);
  };

  const handleValidationUpdate = (error, { keypath }) => {
    validateAttributeField(keypath, error);
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
          gridTemplateColumns: ['1fr', '1fr', `repeat(${columns}, 1fr)`],
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
          initialValues={{ maxPerLevel: edit.balance.maxPerLevel || 0 }}
          validate={attributeFields.maxPerLevel.validate}
          field={attributeFields.maxPerLevel}
          externalUpdate={handleUpdate}
          shrink
          parentError={errors.balance.maxPerLevel}
          onError={handleValidationUpdate}
          isExpanded={values}
        />
        <DynamicForm
          initialValues={{ healthPerLevel: edit.balance.healthPerLevel || 0 }}
          validate={attributeFields.healthPerLevel.validate}
          field={attributeFields.healthPerLevel}
          externalUpdate={handleUpdate}
          shrink
          parentError={errors.balance.healthPerLevel}
          onError={handleValidationUpdate}
          isExpanded={values}
        />
        <DynamicForm
          initialValues={{ costPerLevel: edit.balance.costPerLevel || 0 }}
          validate={attributeFields.costPerLevel.validate}
          field={attributeFields.costPerLevel}
          externalUpdate={handleUpdate}
          shrink
          parentError={errors.balance.costPerLevel}
          onError={handleValidationUpdate}
          isExpanded={values}
        />
      </Box>
    </Box>
  );
};

export default AttrValues;
