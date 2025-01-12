import React, { useState, useMemo, useCallback } from 'react';
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
    id: 789,
  },
  {
    name: 'Mercantile',
    description:
      'Mercantile Settlements focus on establishing and expanding trade, developing vibrant culture, and welcoming artisans.',
    id: 456,
  },
  {
    name: 'Survivalist',
    description:
      'Survivalists focus on gathering food, supplies, medical items, and constructing durable shelters.',
    id: 123,
  },
];

const SettlementPointsCost = ({ attr, setAttr, errors, setErrors }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  // Filter available types
  const available = useMemo(() => {
    const assignedTypes = Object.keys(attr.settlementPointCost || {});
    return settlementTypes.filter(
      (type) => !assignedTypes.includes(type.name.toLowerCase())
    );
  }, [attr, selectedTypes]);

  const fields = useMemo(() => {
    return Object.entries(attr.settlementPointCost || {}).map(
      ([key, value]) => ({
        ...sPCFormData,
        name: key,
        label: key[0].toUpperCase() + key.slice(1),
        tooltip: null,
        keypath: `settlementPointCost.${key}`,
      })
    );
  }, [attr]);

  const handleValidationUpdate = (value, keypath) => {
    const keys = keypath.split('.');
    const updatedErrors = { ...errors };

    keys.reduce((acc, key, idx) => {
      if (idx === keys.length - 1) {
        acc[key] = value;
      } else {
        acc[key] = { ...acc[key] }; // Ensure nested objects are copied
      }
      return acc[key];
    }, updatedErrors);

    setErrors(updatedErrors);
  };

  // Handle drop
  const handleDrop = useCallback(
    (item) => {
      if (selectedTypes.includes(item.name)) {
        const newTypes = [...selectedTypes];
        selectedTypes.filter((type) => type !== item.name);
        setSelectedTypes(newTypes);
      }
      const formattedName = item.name.toLowerCase();
      setAttr((prev) => ({
        ...prev,
        settlementPointCost: {
          ...prev.settlementPointCost,
          [formattedName]: 1,
        },
      }));
      setErrors((prev) => ({
        ...prev,
        settlementPointCost: {
          ...prev.settlementPointCost,
          [formattedName]: null,
        },
      }));
    },

    [attr, setAttr]
  );

  // Handle value change
  const handleValueChange = useCallback(
    (name, value) => {
      setAttr((prev) => ({
        ...prev,
        settlementPointCost: {
          ...prev.settlementPointCost,
          [name]: value,
        },
      }));
    },
    [attr, setAttr]
  );

  const handleRemoveSettlementType = useCallback(
    (name) => {
      const newAttr = { ...attr };
      delete newAttr.settlementPointCost[name];
      setAttr(newAttr);

      const newErrors = { ...errors };
      delete newErrors.settlementPointCost[name];
      setErrors(newErrors);
    },
    [attr, setAttr]
  );

  const handleCheck = (checked, value) => {
    if (checked) {
      setSelectedTypes((prev) => [...prev, value]);
    } else {
      setSelectedTypes((prev) => prev.filter((type) => type !== value));
    }
  };

  const handleTransfer = () => {
    const newAttr = { ...attr };
    const newErrors = { ...errors };
    const attrTypes = { ...attr.settlementPointCost };
    const validateTypes = { ...newErrors.settlementPointCost };
    selectedTypes.forEach((type) => {
      const formattedName = type.toLowerCase();
      attrTypes[formattedName] = 1;
      validateTypes[formattedName] = null;
    });
    setErrors({ ...newErrors, settlementPointCost: validateTypes });
    setAttr({ ...newAttr, settlementPointCost: attrTypes });
    setSelectedTypes([]);
  };

  if (!attr) return <Box>Loading...</Box>;

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
          defaultItems={Object.entries(attr.settlementPointCost).map(
            ([key, value]) => ({
              name: key,
              value,
            })
          )}
        >
          {({ droppedItems }) =>
            droppedItems.map((type, index) => {
              const field = fields.find((f) => f.name === type.name);
              if (!field) return null;
              return (
                <DynamicForm
                  keypath={`settlementPointCost.${type.name}`}
                  key={type.name}
                  initialValues={{
                    [type.name]: attr.settlementPointCost[type.name] || 1,
                  }}
                  field={field}
                  validate={field.validate}
                  externalUpdate={(value) =>
                    handleValueChange(type.name, value)
                  }
                  boxSx={{
                    width: '100%',
                    m: 0,
                    p: 0,
                  }}
                  onRemove={
                    type.name !== 'default'
                      ? () => handleRemoveSettlementType(type.name)
                      : null
                  }
                  onMoreDetails={
                    type.name !== 'default'
                      ? () => console.log('More details')
                      : null
                  }
                  shrink
                  parentError={errors?.settlementPointCost?.[type.name]}
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
