import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  Divider,
} from '@mui/material';
import ValidatedInput from '../../../../utils/ValidatedTextArea/ValidatedInput';
import AttributePreview from './AttributePreview';

import { useDynamicSidebar } from '../../../../../context/SidebarContext';
import GlossarySidebar from '../../../../shared/GlossarySidebar/GlossarySidebar';

const AttributeForm = ({
  attr,
  index,
  onChange = () => {},
  onRemove = () => {},
  level,
}) => {
  const [typeSelect, setTypeSelect] = useState('Select an option');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customSPType, setCustomSPType] = useState('');
  const [customSPValue, setCustomSPValue] = useState(0);

  const handleInputChange = (keyPath, value) => {
    const keys = keyPath.split('.');
    let updatedAttr = { ...attr };

    keys.reduce((acc, key, idx) => {
      if (idx === keys.length - 1) {
        acc[key] = value;
      }
      return acc[key];
    }, updatedAttr);

    onChange(updatedAttr, index);
  };

  const handleRemoveSettlementType = (type) => {
    const updatedSPCosts = { ...attr.settlementPointCost };
    delete updatedSPCosts[type];
    setTypeSelect('Select an option');
    handleInputChange('settlementPointCost', updatedSPCosts);
  };

  const getSettlementTypeOptions = () => {
    const options = [
      { value: 'Survivalist', label: 'Survivalist' },
      { value: 'Mercantile', label: 'Mercantile' },
      { value: 'Fortified', label: 'Fortified' },
      { value: 'Custom', label: 'Custom' }, // Add custom as an option
    ];
    if (attr?.settlementPointCost) {
      return options.filter(
        (option) =>
          !Object.keys(attr.settlementPointCost).includes(option.value)
      );
    }
  };

  const addSettlementPointCost = (type) => {
    if (!type || type.trim() === '') return; // Ensure valid type

    // Check if the type already exists in settlementPointCost
    if (attr.settlementPointCost.hasOwnProperty(type)) {
      alert(`Settlement Point Cost for "${type}" already exists.`);
      return;
    }

    // const existingType = settlementTypes.find((t) => t.name === type);
    // if (existingType) {
    //   alert(`Settlement Type "${type}" already exists!`);
    //   return;
    // }

    // Add the new type with a default value of 0
    const updatedSPCosts = { ...attr.settlementPointCost, [type]: 0 };

    // Update the state with the new settlementPointCost
    handleInputChange('settlementPointCost', updatedSPCosts);

    // Optionally, add type to the database
    // axios
    //   .post('/api/settlement-types', { name: type, status: 'pending' })
    //   .catch((err) => {
    //     console.error('Error adding settlement type:', err);
    //   });
  };

  const handleCustomModalSubmit = () => {
    if (customSPType.trim()) {
      addSettlementPointCost(customSPType, customSPValue);
    }
    setTypeSelect('Select an option');
    setShowCustomModal(false);
    setCustomSPType('');
    setCustomSPValue(0);
  };

  return (
    <Box>
      {/* <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          my: 2,
          justifyContent: 'space-between',
          width: '100%',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      > */}
      <ValidatedInput
        label="Attribute Name"
        value={attr?.name}
        keyPath="name"
        onChange={handleInputChange}
        validated={attr?.name.trim() !== ''}
        validation={(value) => value.trim() !== ''}
        errorText="Attribute name cannot be empty"
        style={{ width: '100%' }}
        tooltipText="Attribute names are unique and can not be changed once created. If an attribute with the same name already exists in your custom assets, it will be overwritten."
      />
      <ValidatedInput
        label="Currency Cost Per Level"
        value={attr?.costPerLevel}
        keyPath="costPerLevel"
        onChange={handleInputChange}
        type="number"
        validated={attr?.costPerLevel >= 0}
        validation={(value) => value >= 0}
        errorText="Cost per level must be a positive number"
        style={{ width: '100%' }}
        tooltipText="Currency Cost Per Level translates to the amount of currency an attribute typically costs to purchase from a Trade Hub. This value scales by settlement level."
      />
      {/* <Typography variant="h6">Values</Typography> */}
      {/*
        Commented out because this is a template creation tool. Starting values
        aren't set until the user creates a settlement. But, we'll keep it here
        in case we decide templates should include a starting value. It's the same
        reason that bonus isn't here; it should only be set when the user creates
        a settlement. At least, that's my thinking.
      */}
      {/* <ValidatedInput
        label="Starting Value"
        value={attr.values.current}
        keyPath="values.current"
        onChange={handleInputChange}
        type="number"
        validated={attr.values.current >= 0}
        validation={(value) => value >= 0}
        errorText="Starting value must be a positive number"
      /> */}
      <ValidatedInput
        label="Max Per Level"
        value={attr?.values.maxPerLevel}
        keyPath="values.maxPerLevel"
        onChange={handleInputChange}
        type="number"
        validated={attr?.maxPerLevel > 0}
        validation={(value) => value > 0}
        errorText="Max per level must be greater than zero"
        style={{ width: '100%' }}
        tooltipText="Max Per Level represents the highest value, per level, the settlement can benefit from this attribute. While a settlement can store more than the max of a resource, scores and ratings are capped at the max per level plus any existing category or attribute bonuses."
      />
      {/* <ValidatedInput
        label="Max"
        value={attr.values.maxPerLevel * level + attr.values.bonus}
        keyPath="max"
        type="number"
        validated={true}
        validation={() => 0 === 0}
        disabled
      /> */}
      {/* </Box> */}
      <ValidatedInput
        label="Description"
        value={attr?.description}
        keyPath="description"
        onChange={handleInputChange}
        validated={attr?.description.trim() !== ''}
        validation={(value) => value.trim() !== ''}
        errorText="Description cannot be empty"
        multiline
        fullWidth
      />
      <Divider variant="h6" textAlign="center">
        <Typography variant="h6"> Settlement Point Costs</Typography>
      </Divider>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gap: 2,
        }}
      >
        {attr?.settlementPointCost &&
          Object.keys(attr?.settlementPointCost).map((type, idx) => (
            <ValidatedInput
              key={idx}
              onRemove={
                type !== 'default'
                  ? () => handleRemoveSettlementType(type)
                  : null
              }
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              value={attr?.settlementPointCost[type]}
              keyPath={`settlementPointCost.${type}`}
              onChange={handleInputChange}
              type="number"
              validated={attr?.settlementPointCost[type] >= 0}
              validation={(value) => value >= 0}
              errorText="Settlement point cost must be a positive number"
              style={{ width: '100%' }}
            />
          ))}
      </Box>
      <>
        <FormControl>
          <InputLabel id="settlement-types">Settlement Types</InputLabel>
          <Select
            label="Settlement Types"
            value={typeSelect}
            onChange={(e) => {
              setTypeSelect(e.target.value);
              if (e.target.value === 'Custom') {
                setShowCustomModal(true); // Show modal when "Custom" is selected
              } else {
                addSettlementPointCost(e.target.value);
                setTypeSelect('Select an option');
              }
            }}
          >
            <MenuItem value="Select an option" disabled>
              Select an option
            </MenuItem>
            {/* {getSettlementTypeOptions().map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
      </>
    </Box>
  );
};

export default AttributeForm;
