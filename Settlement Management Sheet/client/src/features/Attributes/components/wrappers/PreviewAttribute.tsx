import React from 'react';

import { Box, Button, Typography, Divider } from '@mui/material';

import { Icon as CustomIcon } from '../../../../components/index.js';

import PreviewThresholds from 'components/shared/Metadata/ThresholdPreview.jsx';

import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import RowDisplay from '@/components/shared/Layout/RowDisplay.js';

const PreviewAttribute = () => {
  const { tool, id, mode, side } = useShellContext();
  const { current: attr } = useTools('attribute', id);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'center',
        mt: 2,
        gap: 2,
        width: '100%',
        position: 'relative',
        // height: '100%',
        pb: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          height: '88px',
          flexGrow: 1,
          flexShrink: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}
        >
          Icon
        </Typography>
        <Button
          sx={{
            boxShadow: 4,
            borderRadius: '50%',
            height: 64,
            width: 64,
          }}
          disabled
        >
          <CustomIcon
            viewBox={attr?.icon?.viewBox || '0 0 664 512'}
            path={attr?.icon?.d || ''}
            size={24}
            color={attr?.icon?.color || 'primary'}
            backgroundColor={attr?.icon?.backgroundColor || 'background.paper'}
          />
        </Button>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 2',
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'start',
          height: '100%',
        }}
      >
        <Typography variant="h6">Name:</Typography>
        <Typography>{attr?.name || 'None'}</Typography>
      </Box>
      <Divider
        sx={{ gridColumn: 'span 3', borderColor: '#ccc', fontWeight: 'bold' }}
      >
        DESCRIPTION
      </Divider>
      <Box
        sx={{
          gridColumn: 'span 3',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'start',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ textAlign: 'start' }} variant="body1">
          {attr?.description || 'No description'}
        </Typography>
        <Box
          sx={{
            gridColumn: 'span 3',
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Type:
          </Typography>
          <Typography variant="body1">
            {attr?.isPositive ? 'Positive' : 'Negative'}
          </Typography>
        </Box>
      </Box>
      <Divider
        sx={{
          gridColumn: 'span 3',
          borderColor: '#ccc',
          fontWeight: 'bold',
        }}
      >
        {' '}
        SCALING PER LEVEL{' '}
      </Divider>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
          gridColumn: 'span 3',
          columnGap: 2,
        }}
      >
        <RowDisplay name="Max" value={attr?.balance?.max?.base} even={false} />
        <RowDisplay
          name="Health"
          value={attr?.balance?.health?.base}
          even={true}
        />
        <RowDisplay
          name="Cost"
          value={attr?.balance?.cost?.base}
          even={false}
        />
      </Box>

      <Divider
        sx={{ gridColumn: 'span 3', borderColor: '#ccc', fontWeight: 'bold' }}
      >
        SETTLEMENT POINT COSTS
      </Divider>

      {attr.settlementPointCost.order.map((id: string, index: number) => (
        <RowDisplay
          key={id}
          name={attr.settlementPointCost.data[id].name}
          value={attr.settlementPointCost.data[id].value}
          even={index % 2 === 0}
        />
      ))}
      <Divider
        sx={{ gridColumn: 'span 3', borderColor: '#ccc', fontWeight: 'bold' }}
      >
        THRESHOLDS
      </Divider>
      <PreviewThresholds
        data={attr.thresholds.data}
        order={attr.thresholds.order}
      />
    </Box>
  );
};

export default PreviewAttribute;
