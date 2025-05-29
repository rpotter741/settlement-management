import React, { memo } from 'react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { DynamicForm } from 'components/index.js';

const Dependency = ({
  threshold,
  errors,
  index,
  id,
  handleModifierValidation,
  handleModifierChange,
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
      <Typography sx={{ width: '33%', textAlign: 'left' }} variant="h6">
        {threshold.name.charAt(0).toUpperCase() + threshold.name.slice(1)}:
      </Typography>
      <DynamicForm
        initialValues={{ modifier: threshold.modifier }}
        field={{
          name: 'modifier',
          label: 'Modifier',
          value: threshold.modifier,
          type: 'number',
          textSx: { width: '100%' },
          validate: (value) => {
            if (value < 0 || value > 5) {
              return 'Value must be between 0 and 5';
            }
            return null;
          },
          id: id,
          index: index,
        }}
        boxSx={{ width: '66%' }}
        shrink={true}
        externalUpdate={handleModifierChange}
        parentError={errors?.max || null}
        onError={handleModifierValidation}
      />
    </Box>
  );
};

export default memo(Dependency);
