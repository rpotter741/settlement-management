import React from 'react';
import { useAttribute } from '../../hooks/useEditAttribute.jsx';

import { attributeFields } from '../../helpers/attributeFormData.js';
import {
  Icon as CustomIcon,
  DynamicForm,
} from '../../../../components/index.js';

import { Box, Typography, Button } from '@mui/material';

const AttrMetaData = ({ setShowModal }) => {
  const { editAttribute, errors, updateAttribute, validateAttributeField } =
    useAttribute();
  const attr = editAttribute;
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
    </>
  );
};

export default AttrMetaData;
