import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { useTools } from 'hooks/useTool.tsx';
import { useToolContext } from 'context/ToolContext.jsx';

import {
  Box,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';

import {
  DraggableList,
  DropZone,
  DynamicForm,
} from '../../../../components/index.js';
import sPCFormData from '../../helpers/sPCFormData.js';

import capitalize from 'utility/capitalize.js';

const settlementTypes = [
  {
    name: 'Fortified',
    description:
      'Fortified Settlements put their trust in theirs walls, preemptive reconnaissance, and well-trained troops.',
    id: '789',
  },
  {
    name: 'Mercantile',
    description:
      'Mercantile Settlements focus on establishing and expanding trade, developing vibrant culture, and welcoming artisans.',
    id: '456',
  },
  {
    name: 'Survivalist',
    description:
      'Survivalists focus on gathering food, supplies, medical items, and constructing durable shelters.',
    id: '123',
  },
];

const SettlementPointsCost = () => {
  const { id } = useToolContext();
  const {
    edit,
    selectValue,
    updateTool: updateAttribute,
    validateToolField: validateAttributeField,
    errors: spcErrors,
  } = useTools('attribute', id);

  const settlementPointCost = selectValue('settlementPointCost');
  const costs = edit?.settlementPointCost.data;
  const errors = spcErrors.settlementPointCost;
  const order = edit?.settlementPointCost.order;

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    console.log(edit);
  }, [edit]);

  const available = useMemo(() => {
    const assignedTypes = Object.keys(costs || {}).reduce((types, id) => {
      types.push(id);
      return types;
    }, []);
    const types = settlementTypes.filter(
      (type) => !assignedTypes.includes(type.id)
    );
    return types;
  }, [costs]);

  const fields = useMemo(() => {
    return Object.entries(costs || {}).map(([id, spc]) => ({
      ...sPCFormData,
      name: spc.name,
      label: spc.name.charAt(0).toUpperCase() + spc.name.slice(1),
      tooltip: null,
      id,
    }));
  }, [costs, edit]);

  const handleValidationUpdate = (error, { id }) => {
    validateAttributeField(`settlementPointCost.${id}.value`, error);
  };

  // Handle value change
  const handleValueChange = useCallback(
    (value, { id }) => {
      updateAttribute(`settlementPointCost.data.${id}.value`, value);
    },
    [costs]
  );

  const handleRemoveSettlementType = useCallback(
    (id) => {
      const newSPC = { ...costs };
      delete newSPC[id];
      updateAttribute('settlementPointCost.data', newSPC);

      const newErrors = { ...errors };
      delete newErrors[id];
      validateAttributeField('settlementPointCost', newErrors);

      const newOrder = order.filter((order) => order !== id);
      updateAttribute('settlementPointCost.order', newOrder);
    },
    [costs, errors]
  );

  const handleAdd = () => {
    if (!selectedValue?.id) return;
    const spc = selectedValue;
    const newSPC = { ...costs };
    const newErrors = { ...errors };
    const newOrder = [...order];

    newSPC[spc.id] = { name: spc.name.toLowerCase(), value: 1 };
    newErrors[spc.id] = { name: null, value: null };
    newOrder.push(spc.id);

    updateAttribute('settlementPointCost.data', newSPC);

    validateAttributeField('settlementPointCost', newErrors);

    updateAttribute('settlementPointCost.order', newOrder);

    setInputValue('');
    setSelectedValue(null); // Clear after transfer
  };

  if (!settlementPointCost) return <Box>Loading...</Box>;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 0.1fr 1fr',
        // alignItems: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ gridColumn: 'span 3', p: 2 }}>
        Define the{' '}
        <Tooltip
          title={
            <Typography>
              Settlements earn 1 settlement point per level per turn, barring
              other boons or banes. Click for for more information.
            </Typography>
          }
        >
          <Typography
            component="span"
            sx={{
              textDecoration: 'underline',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Settlement Point Cost{' '}
          </Typography>
        </Tooltip>
        of this attribute per Settlement Type. A value of <strong>0</strong>{' '}
        means this cannot be purchased with settlement points for that
        settlement type.
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'start', width: '100%' }}>
        <Autocomplete
          inputValue={inputValue}
          options={available}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Settlement Type"
              variant="outlined"
              error={!!errors?.name}
              helperText={errors?.name}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdd();
                }
              }}
            />
          )}
          onChange={(event, newValue) => {
            setSelectedValue(newValue);
            setInputValue(newValue?.name || '');
          }}
          renderOption={(props, option) => (
            <Box
              {...props}
              key={option.name}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Tooltip
                title={<Typography>{option.description}</Typography>}
                placement="left"
                arrow
              >
                <Typography>{option.name}</Typography>
              </Tooltip>
            </Box>
          )}
          sx={{ my: 2, width: '100%' }}
        />
      </Box>
      <Divider orientation="vertical" flexItem>
        <Chip
          label={<ArrowForward />}
          onClick={handleAdd}
          sx={{ width: '100%', color: 'white' }}
        />
      </Divider>
      <Box>
        {order.map((id, index) => {
          const field = fields.find((f) => f.id === id);
          if (!field) return null;
          return (
            <DynamicForm
              key={costs[id].name}
              initialValues={{
                [costs[id].name]: costs[id].value || 1,
              }}
              field={field}
              validate={field.validate}
              externalUpdate={handleValueChange}
              boxSx={{
                width: '100%',
                m: 0,
                p: 0,
              }}
              onRemove={
                costs[id].name !== 'default'
                  ? () => handleRemoveSettlementType(id)
                  : null
              }
              onMoreDetails={
                costs[id].name !== 'default'
                  ? () => console.log('More details')
                  : null
              }
              shrink
              parentError={errors[id] ? errors[id].value : null}
              onError={handleValidationUpdate}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default SettlementPointsCost;
