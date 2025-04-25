import React from 'react';
import { useAttribute } from '../../hooks/useEditAttribute.jsx';
import { useTools } from 'hooks/useTool.jsx';
import { useToolContext } from 'context/ToolContext.jsx';

import { attributeFields } from '../../helpers/attributeFormData.js';
import {
  Icon as CustomIcon,
  DynamicForm,
} from '../../../../components/index.js';

import { Box, Typography, Button, Tooltip, Switch } from '@mui/material';

const AttrMetaData = ({ setShowModal }) => {
  const { tool, id } = useToolContext();
  const {
    edit: attr,
    errors,
    updateTool: updateAttribute,
    validateToolField: validateAttributeField,
  } = useTools(tool, id);

  console.log(attr, 'attr');

  const handleUpdate = (updates, { keypath }) => {
    updateAttribute(keypath, updates);
  };
  const handleValidationUpdate = (error, { keypath }) => {
    validateAttributeField(keypath, error);
  };
  //
  return (
    <>
      <Box
        sx={{
          gridColumn: 'span 3',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            flexGrow: 1,
            flexShrink: 2,
          }}
        >
          <Typography variant="h6">Icon</Typography>
          <Button
            onClick={() => setShowModal('Change Icon')}
            sx={{
              boxShadow: 4,
              borderRadius: 4,
            }}
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
          boxSx={{ flexGrow: 2, flexShrink: 1, px: 1 }}
          externalUpdate={handleUpdate}
          shrink
          parentError={errors?.name}
          onError={handleValidationUpdate}
        />
      </Box>
      <DynamicForm
        initialValues={{ description: attr?.description || '' }}
        field={attributeFields.description}
        boxSx={{ gridColumn: 'span 3', px: 1 }}
        externalUpdate={handleUpdate}
        shrink
        parentError={errors?.description}
        onError={handleValidationUpdate}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pl: 2,
          gap: 16,
          gridColumn: 'span 3',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Tooltip title="Positive type is best a high scores. Negative type is best a low scores.">
            <Typography variant="h6">Attribute Type</Typography>
          </Tooltip>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">
              {attr?.positive ? 'Positive' : 'Negative'}
            </Typography>
            <Switch
              checked={attr?.positive}
              onChange={(e) => {
                updateAttribute('positive', e.target.checked);
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AttrMetaData;
