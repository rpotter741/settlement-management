import React, { memo } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import ToolInput from '../DynamicForm/ToolInput.js';

const ThresholdNameField = {
  label: '',
  type: 'text',
  tooltip: '',
  validateFn: (value: string) => {
    if (value.length < 3) {
      return 'oh shitty fuck, name must be at least 3 characters long';
    }
    return null;
  },
};

const ThresholdMaxField = {
  label: 'Value',
  type: 'number',
  validateFn: (value: number) => {
    if (value < 0 || value > 100) {
      return 'Value must be between 0 and 100';
    }
    return null;
  },
};

interface ThresholdProps {
  id: string;
  handleRemove?: (id: string) => void;
  handleBlur?: () => void;
}

const Threshold: React.FC<ThresholdProps> = ({
  id,
  handleRemove,
  handleBlur,
}) => {
  return (
    <Box
      key={id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: { sm: 0, md: 4, lg: 6, xl: 8, xxl: 12 },
        transition: 'top 0.3s ease, left 0.3s ease',
        gap: 2,
      }}
    >
      <ToolInput
        inputConfig={{
          ...ThresholdNameField,
          keypath: `thresholds.data.${id}.name`,
        }}
        style={{ width: '100%' }}
      />
      <ToolInput
        inputConfig={{
          ...ThresholdMaxField,
          keypath: `thresholds.data.${id}.max`,
        }}
        style={{ width: '66%' }}
        onBlur={handleBlur}
      />
      {handleRemove !== null && (
        <Tooltip title="Remove threshold">
          <Button
            variant="contained"
            aria-label="Remove threshold"
            onClick={handleRemove ? () => handleRemove(id) : () => {}}
            sx={{ px: 4 }}
          >
            Remove
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default memo(Threshold);
