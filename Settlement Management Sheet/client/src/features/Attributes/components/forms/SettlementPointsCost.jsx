import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAttribute } from '../../hooks/useEditAttribute.jsx';
import {
  selectSettlementPointCost as selectAttrSPC,
  selectSettlementPointCostErrors as selectAttrSPCErrors,
  selectSettlementPointCostOrder,
} from '../../state/attributeSelectors.js';

import { updateEditAttribute } from '../../state/attributeSlice';
import {
  validateField,
  setErrorField,
} from '../../../validation/validationSlice';
import { v4 as newId } from 'uuid';

import { Box, Typography, Divider, Tooltip, IconButton } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';

import {
  DraggableList,
  DropZone,
  DynamicForm,
} from '../../../../components/index.js';
import sPCFormData from '../../helpers/sPCFormData.js';

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
  const { settlementPointCost, updateAttribute, validateAttributeField } =
    useAttribute();
  const dispatch = useDispatch();
  const costs = settlementPointCost.data;
  const errors = settlementPointCost.errors;

  const [selectedTypes, setSelectedTypes] = useState([]);

  React.useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  const available = useMemo(() => {
    console.log('recalculating available');
    const assignedTypes = Object.keys(costs || {}).reduce((types, id) => {
      types.push(id);
      return types;
    }, []);
    console.log(assignedTypes, 'assigned types');
    const types = settlementTypes.filter(
      (type) => !assignedTypes.includes(type.id)
    );
    console.log(types, 'types');
    return types;
  }, [costs, selectedTypes, dispatch]);

  const fields = useMemo(() => {
    return Object.entries(costs || {}).map(([id, spc]) => ({
      ...sPCFormData,
      name: spc.name,
      label: spc.name.charAt(0).toUpperCase() + spc.name.slice(1),
      tooltip: null,
      id,
    }));
  }, [costs]);

  const orderedList = useMemo(() => {
    return settlementPointCost.order.map((id) => ({
      id,
      ...settlementPointCost.data[id],
    }));
  });

  const handleValidationUpdate = (error, { id }) => {
    validateAttributeField(`settlementPointCost.${id}.value`, error);
  };

  // Handle drop
  const handleDrop = useCallback(
    (item) => {
      console.log(item.id, 'item id');
      setSelectedTypes((prevSelected) =>
        prevSelected.includes(item.id)
          ? prevSelected.filter((id) => id !== item.id)
          : prevSelected
      );

      dispatch((dispatch, getState) => {
        const currentSPC = selectAttrSPC(getState());
        const formattedName = item.name.toLowerCase();
        const newSPC = {
          ...currentSPC,
          [item.id]: { name: formattedName, value: 1 },
        };
        updateAttribute('settlementPointCost', newSPC);

        const currentErrors = selectAttrSPCErrors(getState());
        const newErrors = {
          ...currentErrors,
          [item.id]: { name: null, value: null },
        };

        validateAttributeField('settlementPointCost', newErrors);

        const currentOrder = selectSettlementPointCostOrder(getState());
        const newOrder = [...currentOrder, item.id];
        updateAttribute('settlementPointCostOrder', newOrder);
      });
    },
    [dispatch]
  );

  // Handle value change
  const handleValueChange = useCallback(
    (value, { id }) => {
      updateAttribute(`settlementPointCost.${id}.value`, value);
    },
    [costs]
  );

  const handleRemoveSettlementType = useCallback(
    (id) => {
      const newSPC = { ...costs };
      delete newSPC[id];
      updateAttribute('settlementPointCost', newSPC);

      const newErrors = { ...errors };
      delete newErrors[id];
      validateAttributeField('settlementPointCost', newErrors);

      const newOrder = settlementPointCost.order.filter(
        (order) => order !== id
      );
      updateAttribute('settlementPointCostOrder', newOrder);
    },
    [costs, errors]
  );

  const handleCheck = (checked, value) => {
    if (checked) {
      setSelectedTypes((prev) => [...prev, value]);
    } else {
      setSelectedTypes((prev) => prev.filter((type) => type !== value));
    }
  };

  const handleTransfer = useCallback(() => {
    dispatch((dispatch, getState) => {
      const currentSPC = selectAttrSPC(getState());
      const currentErrors = selectAttrSPCErrors(getState());

      const newSPC = { ...currentSPC };
      const newErrors = { ...currentErrors };
      const order = selectSettlementPointCostOrder(getState());
      const newOrder = [...order];

      selectedTypes.forEach((type) => {
        newSPC[type.id] = { name: type.name.toLowerCase(), value: 1 };
        newErrors[type.id] = { name: null, value: null };
        newOrder.push(type.id);
      });

      updateAttribute('settlementPointCost', newSPC);

      validateAttributeField('settlementPointCost', newErrors);

      updateAttribute('settlementPointCostOrder', newOrder);

      setSelectedTypes([]); // Clear after transfer
    });
  }, [selectedTypes, dispatch]);

  if (!settlementPointCost) return <Box>Loading...</Box>;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 16px 1fr',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          my: 2,
          height: '100%',
        }}
      >
        <DraggableList
          list={available}
          label="Available"
          type="type"
          onCheck={handleCheck}
          onDetails={true}
          selected={selectedTypes}
        />
      </Box>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: 'fit-content', // Automatically adjusts to content
        }}
      >
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            position: 'absolute',
            height: '100%',
            backgroundColor: 'divider',
            width: '1px',
          }}
        >
          {/* Adornment (Button) */}
          <Tooltip title="Transfer items">
            <IconButton
              aria-label="Transfer items" // For screen readers
              onClick={handleTransfer} // Your transfer logic
              sx={{
                borderRadius: 1, // Optional: Adjust for a square/rounded look
                p: 1, // Optional: Control padding for a compact feel
                backgroundColor: 'primary.main',
                color: 'background.paper',
                position: 'absolute',
                left: '50%', // Center the button
                transform: 'translate(-50%, 0)', // Center the button
                '&:hover': {
                  backgroundColor: 'success.main',
                },
              }}
            >
              <ArrowForward />
            </IconButton>
          </Tooltip>
        </Divider>
      </Box>

      <Box
        sx={{
          mt: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          p: 1,
          height: '100%',
        }}
      >
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Assigned
        </Typography>
        <DropZone type="type" handleAdd={handleDrop} defaultItems={orderedList}>
          {({ droppedItems }) =>
            droppedItems.map((type, index) => {
              const field = fields.find((f) => f.id === type.id);
              if (!field) return null;
              return (
                <DynamicForm
                  key={type.name}
                  initialValues={{
                    [type.name]: type.value || 1,
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
                    type.name !== 'default'
                      ? () => handleRemoveSettlementType(type.id)
                      : null
                  }
                  onMoreDetails={
                    type.name !== 'default'
                      ? () => console.log('More details')
                      : null
                  }
                  shrink
                  parentError={errors[type.id] ? errors[type.id].value : null}
                  onError={handleValidationUpdate}
                />
              );
            })
          }
        </DropZone>
      </Box>
    </Box>
  );
};

export default SettlementPointsCost;
