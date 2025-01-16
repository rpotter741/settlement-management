import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAttrSPC,
  selectAttrSPCErrors,
} from '../../../features/validation/selectors/attributeSelectors';

import { updateEditAttribute } from '../../../features/attribute/attributeSlice';
import {
  validateField,
  setErrorField,
} from '../../../features/validation/validationSlice';
import { v4 as newId } from 'uuid';

import { Box, Typography, Divider, Tooltip, IconButton } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';

import DraggableList from '../../utils/DnD/DraggableList';
import DropZone from '../../utils/DnD/DropZone';
import DynamicForm from '../../utils/DynamicForm/DynamicForm';
import sPCFormData from '../../../helpers/attributes/sPCFormData.js';

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
  const dispatch = useDispatch();
  const settlementPointCost = useSelector(selectAttrSPC);
  const errors = useSelector(selectAttrSPCErrors);

  const [selectedTypes, setSelectedTypes] = useState([]);

  React.useEffect(() => {
    console.log('settlementPointCost', settlementPointCost);
  }, [settlementPointCost]);

  const available = useMemo(() => {
    const assignedTypes = Object.keys(settlementPointCost || {}).reduce(
      (types, id) => {
        types.push(id);
        return types;
      },
      []
    );
    const types = settlementTypes.filter(
      (type) => !assignedTypes.includes(type.id)
    );
    return types;
  }, [settlementPointCost, selectedTypes]);

  const fields = useMemo(() => {
    return Object.entries(settlementPointCost || {}).map(([id, spc]) => ({
      ...sPCFormData,
      name: spc.name,
      label: spc.name.charAt(0).toUpperCase() + spc.name.slice(1),
      tooltip: null,
      id,
    }));
  }, [settlementPointCost]);

  const handleValidationUpdate = (error, id) => {
    dispatch(
      validateField({
        tool: 'attribute',
        error,
        id,
        keypath: 'settlementPointCost',
        field: 'value',
      })
    );
  };

  // Handle drop
  const handleDrop = useCallback(
    (item) => {
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

        dispatch(
          updateEditAttribute({
            keypath: 'settlementPointCost',
            updates: newSPC,
          })
        );

        const currentErrors = selectAttrSPCErrors(getState());
        const newErrors = {
          ...currentErrors,
          [item.id]: { name: null, value: null },
        };

        dispatch(
          setErrorField({
            tool: 'attribute',
            value: newErrors,
            keypath: 'settlementPointCost',
          })
        );
      });
    },
    [dispatch]
  );

  // Handle value change
  const handleValueChange = useCallback(
    (value, { id }) => {
      dispatch(
        updateEditAttribute({
          keypath: 'settlementPointCost',
          updates: value,
          id,
        })
      );
    },
    [settlementPointCost]
  );

  const handleRemoveSettlementType = useCallback(
    (id) => {
      const newSPC = { ...settlementPointCost };
      delete newSPC[id];
      dispatch(
        updateEditAttribute({
          keypath: 'settlementPointCost',
          updates: newSPC,
        })
      );

      const newErrors = { ...errors };
      delete newErrors[id];
      dispatch(
        setErrorField({
          tool: 'attribute',
          keypath: 'settlementPointCost',
          value: newErrors,
        })
      );
    },
    [settlementPointCost]
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

      selectedTypes.forEach((type) => {
        const id = newId();
        newSPC[id] = { name: type.toLowerCase(), value: 1 };
        newErrors[id] = { name: null, value: null };
      });

      dispatch(
        updateEditAttribute({
          keypath: 'settlementPointCost',
          updates: newSPC,
        })
      );

      dispatch(
        setErrorField({
          tool: 'attribute',
          keypath: 'settlementPointCost',
          value: newErrors,
        })
      );

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
        <DropZone
          type="type"
          handleAdd={handleDrop}
          defaultItems={Object.entries(settlementPointCost).map(
            ([id, spc]) => ({
              id,
              name: spc.name,
              value: spc.value,
            })
          )}
        >
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
