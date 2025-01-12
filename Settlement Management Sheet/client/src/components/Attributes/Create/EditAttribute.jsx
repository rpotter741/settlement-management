import React, { useEffect, useState } from 'react';

import {
  Card,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormLabel,
  InputLabel,
  Typography,
  Divider,
  Switch,
  Modal,
  Tooltip,
  IconButton,
} from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

import { attributeFields } from '../../../helpers/attributes/attributeFormData';
import autobalanceSteps from '../../../helpers/attributes/attributeAutoBalance.js';

import CustomIcon from '../../utils/Icons/Icon.jsx';
import TitledCollapse from '../../utils/TitledCollapse/TitledCollapse';
import DynamicForm from '../../utils/DynamicForm/DynamicForm';
import SettlementPointsCost from '../components/SettlementPointsCost.jsx';
import AttributeThresholds from '../components/AttributeThresholds.jsx';
import TagTable from './TagTable';

const EditAttribute = ({ attr, setAttr, setShowModal, errors, setErrors }) => {
  const [editMode, setEditMode] = useState(false);
  const [autobalance, setAutobalance] = useState(false);
  const [typeSelect, setTypeSelect] = useState('Select an option');
  const [customSPType, setCustomSPType] = useState('');
  const [customSPValue, setCustomSPValue] = useState(0);
  const [values, setValues] = useState(false);
  const [thresholds, setThresholds] = useState(false);
  const [tags, setTags] = useState(false);
  const [spCosts, setSpCosts] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleUpdate = (value, keypath) => {
    const keys = keypath.split('.');
    const updatedAttr = { ...attr };

    keys.reduce((acc, key, idx) => {
      if (idx === keys.length - 1) {
        acc[key] = value;
      } else {
        acc[key] = { ...acc[key] }; // Ensure nested objects are copied
      }
      return acc[key];
    }, updatedAttr);
    setAttr(updatedAttr);
  };

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
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          pt: 2,
        }}
      >
        <Typography variant="h6">Icon</Typography>
        <Button
          onClick={() => setShowModal('Change Icon')}
          sx={{ boxShadow: 4, borderRadius: 4 }}
        >
          <CustomIcon
            viewBox={attr?.icon?.viewBox || '0 0 664 512'}
            path={attr?.icon?.d || ''}
            size={24}
            color={attr?.iconColor}
          />
        </Button>
      </Box>
      <DynamicForm
        initialValues={{ name: attr?.name || '' }}
        field={attributeFields.name}
        boxSx={{ gridColumn: 'span 2' }}
        externalUpdate={handleUpdate}
        shrink
        parentError={errors?.name}
        onError={handleValidationUpdate}
      />
      <DynamicForm
        initialValues={{ description: attr?.description || '' }}
        field={attributeFields.description}
        boxSx={{ gridColumn: 'span 3' }}
        externalUpdate={handleUpdate}
        shrink
        parentError={errors?.description}
        onError={handleValidationUpdate}
      />
      <Divider sx={{ gridColumn: 'span 3' }} />
      <TitledCollapse
        title="Values"
        titleType="h6"
        defaultState={values}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{
          gridColumn: 'span 3',
        }}
        noDefaultHandler={() => setValues(!values)}
      >
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
            initialValues={{ maxPerLevel: attr?.values?.maxPerLevel || 0 }}
            validate={attributeFields.maxPerLevel.validate}
            field={attributeFields.maxPerLevel}
            externalUpdate={handleUpdate}
            shrink
            parentError={errors?.values?.maxPerLevel}
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
      </TitledCollapse>
      <TitledCollapse
        title="Settlement Point Costs"
        titleType="h6"
        defaultState={spCosts}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        noDefaultHandler={() => setSpCosts(!spCosts)}
      >
        <SettlementPointsCost
          attr={attr}
          setAttr={setAttr}
          handleUpdate={handleUpdate}
          errors={errors}
          setErrors={setErrors}
        />
      </TitledCollapse>
      <TitledCollapse
        title="Thresholds"
        titleType="h6"
        defaultState={thresholds}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        noDefaultHandler={() => setThresholds(!thresholds)}
      >
        <AttributeThresholds
          attr={attr}
          setAttr={setAttr}
          errors={errors}
          setErrors={setErrors}
        />
      </TitledCollapse>
      <TitledCollapse
        title={`Tags (${attr.tags?.length} / 5)`}
        titleType="h6"
        defaultState={tags}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        noDefaultHandler={() => setTags(!tags)}
      >
        <TagTable attr={attr} setAttr={setAttr} />
      </TitledCollapse>
    </Box>
  );
};

export default EditAttribute;
