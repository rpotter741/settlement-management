import React, { useEffect, useState, memo } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import DynamicForm from '../../utils/DynamicForm/DynamicForm';

const Threshold = ({
  threshold,
  errors,
  index,
  handleRemove,
  handleNameValidation,
  handleMaxValidation,
  handleNameChange,
  handleMaxChange,
}) => {
  return (
    <Box
      key={threshold.id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 12,
        transition: 'top 0.3s ease, left 0.3s ease',
        gap: 2,
      }}
    >
      <DynamicForm
        initialValues={{ name: threshold.name }}
        field={{
          name: 'name',
          type: 'text',
          textSx: { width: '100%' },
          // placeholder: placeholders[index],
          validate: (value) => {
            if (value.length < 3) {
              return 'Name must be longer than 3 characters';
            }
            return null;
          },
          id: threshold.id,
          keypath: `thresholds.${index}.name`,
        }}
        shrink={true}
        boxSx={{ width: '80%' }}
        externalUpdate={handleNameChange}
        parentError={errors?.name}
        onError={handleNameValidation}
        id={threshold.id}
      />
      <DynamicForm
        initialValues={{ max: threshold.max }}
        field={{
          name: 'max',
          label: 'Value',
          type: 'number',
          textSx: { width: '100%' },
          validate: (value) => {
            if (value < 0 || value > 100) {
              return 'Value must be between 0 and 100';
            }
            return null;
          },
          id: threshold.id,
        }}
        boxSx={{ width: '66%' }}
        shrink={true}
        externalUpdate={handleMaxChange}
        parentError={errors?.max || null}
        onError={handleMaxValidation}
        min={0}
      />
      <Tooltip title="Remove threshold">
        <Button
          variant="contained"
          aria-label="Remove threshold"
          onClick={() => handleRemove(threshold.id)}
          sx={{ px: 4 }}
        >
          Remove
        </Button>
      </Tooltip>
    </Box>
  );
};

export default memo(Threshold);
