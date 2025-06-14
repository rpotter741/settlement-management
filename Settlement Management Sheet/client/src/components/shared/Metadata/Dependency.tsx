import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import ToolInput from '@/components/shared/DynamicForm/ToolInput.jsx';

export interface DependencyThreshold {
  id: string;
  name: string;
  modifier: number;
}

interface DependencyProps {
  threshold: DependencyThreshold;
  keypath: string;
}

const modifierField = {
  label: 'Modifier',
  type: 'number',
  validateFn: (value: number) => {
    if (value < 0 || value > 5) {
      return 'Value must be between 0 and 5';
    }
    return null;
  },
};

const Dependency: React.FC<DependencyProps> = ({ threshold, keypath }) => {
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
      <ToolInput
        inputConfig={{ ...modifierField, keypath }}
        style={{ width: '66%' }}
      />
    </Box>
  );
};

export default memo(Dependency);
