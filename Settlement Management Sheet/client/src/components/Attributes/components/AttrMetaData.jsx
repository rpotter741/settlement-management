import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAttrMetadata,
  selectAttrMetadataErrors,
} from '../../../features/validation/selectors/attributeSelectors.js';

import { attributeFields } from '../../../helpers/attributes/attributeFormData';
import CustomIcon from '../../utils/Icons/Icon.jsx';
import DynamicForm from '../../utils/DynamicForm/DynamicForm';
import { updateEditAttribute } from '../../../features/attribute/attributeSlice';
import { validateField } from '../../../features/validation/validationSlice';

import { Box, Typography, Button } from '@mui/material';

const AttrMetaData = ({ setShowModal }) => {
  const dispatch = useDispatch();
  const attr = useSelector(selectAttrMetadata);
  const errors = useSelector(selectAttrMetadataErrors);
  const handleUpdate = (updates, { keypath }) => {
    dispatch(updateEditAttribute({ keypath, updates }));
  };
  const handleValidationUpdate = (error, { keypath }) => {
    dispatch(validateField({ tool: 'attribute', error, keypath }));
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
