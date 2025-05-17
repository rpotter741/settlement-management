import React from 'react';

import { Box, Button, Typography, Divider } from '@mui/material';

import { Icon as CustomIcon } from '../../../../components/index.js';

import PreviewThresholds from 'components/shared/Metadata/ThresholdPreview.jsx';

import { useTools } from 'hooks/useTool.tsx';
import { useToolContext } from 'context/ToolContext.jsx';

const PreviewAttribute = () => {
  const { tool, id, mode, side } = useToolContext();
  console.log('PreviewAttribute', tool, id, mode, side);
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
        backgroundColor: 'background.paper',
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
          gap: 2,
          height: '100%',
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}
        >
          Icon
        </Typography>
        <Button sx={{ boxShadow: 4, borderRadius: 4 }} disabled>
          <CustomIcon
            viewBox={attr?.icon?.viewBox || '0 0 664 512'}
            path={attr?.icon?.d || ''}
            size={24}
            color={attr?.iconColor}
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
            {attr?.positive ? 'Positive' : 'Negative' || 'None'}
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
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'start',
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', width: '50%', textAlign: 'start' }}
          >
            Max:
          </Typography>
          <Typography>{attr?.balance?.maxPerLevel}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'start',
            backgroundColor: 'background.default',
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', width: '50%', textAlign: 'start' }}
          >
            Health:
          </Typography>
          <Typography>{attr?.balance?.healthPerLevel}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'start',
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', width: '50%', textAlign: 'start' }}
          >
            Cost:
          </Typography>
          <Typography>{attr?.balance?.costPerLevel}</Typography>
        </Box>
      </Box>

      <Divider
        sx={{ gridColumn: 'span 3', borderColor: '#ccc', fontWeight: 'bold' }}
      >
        SETTLEMENT POINT COSTS
      </Divider>

      {attr.settlementPointCost.order.map((id) => (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'start',
            gridColumn: 'span 3',
          }}
          key={id}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', width: '20%', textAlign: 'start' }}
          >
            {attr.settlementPointCost.data[id].name.charAt(0).toUpperCase() +
              attr.settlementPointCost.data[id].name.slice(1)}
            :
          </Typography>
          <Typography>
            <strong>{attr.settlementPointCost.data[id].value}</strong>
          </Typography>
        </Box>
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
