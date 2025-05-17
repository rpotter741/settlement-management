import React, { memo } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { DynamicForm } from 'components/index.js';

const Threshold = ({
  threshold,
  errors,
  index,
  id,
  handleRemove,
  handleNameValidation,
  handleMaxValidation,
  handleNameChange,
  handleMaxChange,
  handleBalanceChange,
}) => {
  console.log(errors);
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
          value: threshold.name,
          textSx: { width: '100%' },
          validate: (value) => {
            if (value.length < 3) {
              return 'Name must be longer than 3 characters';
            }
            return null;
          },
          id,
          keypath: `thresholds.${id}.name`,
        }}
        shrink={true}
        boxSx={{ width: '100%' }}
        externalUpdate={handleNameChange}
        parentError={errors?.name}
        onError={handleNameValidation}
      />
      <DynamicForm
        initialValues={{ max: threshold.max }}
        field={{
          name: 'max',
          label: 'Value',
          value: threshold.max,
          type: 'number',
          textSx: { width: '100%' },
          validate: (value) => {
            if (value < 0 || value > 100) {
              return 'Value must be between 0 and 100';
            }
            return null;
          },
          id,
        }}
        boxSx={{ width: '66%' }}
        shrink={true}
        externalUpdate={handleMaxChange}
        parentError={errors?.max || null}
        onError={handleMaxValidation}
        onBlur={handleBalanceChange}
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
