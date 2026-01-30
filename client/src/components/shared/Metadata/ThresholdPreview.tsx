import { Box, Typography } from '@mui/material';
import React from 'react';
import { Threshold, Thresholds } from 'types/common.js';
import RowDisplay from '../Layout/RowDisplay.js';

interface PreviewThresholdsProps {
  data: Record<string, Threshold>;
  order: string[];
}

const PreviewThresholds: React.FC<PreviewThresholdsProps> = ({
  data,
  order,
}) => {
  return (
    <Box
      sx={{
        gridColumn: 'span 3',
        columnGap: 2,
        display: 'grid',
        gridTemplateRows: 'repeat(7, 1fr)',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridAutoFlow: 'column',
      }}
    >
      {order.map((id, n) => {
        const { name, max } = data[id];
        return (
          <RowDisplay
            key={id}
            name={name}
            value={max}
            style={{ width: '100%', maxWidth: '256px' }}
            even={n % 2 === 0}
          />
        );
      })}
    </Box>
  );
};

export default PreviewThresholds;
