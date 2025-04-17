import React from 'react';

import { Box, Button, Typography, Divider } from '@mui/material';

import { Icon as CustomIcon } from '../../../../components/index.js';

import { useAttribute } from '../../hooks/useEditAttribute.jsx';

import { useTools } from 'hooks/useTool.jsx';

const PreviewAttribute = () => {
  const { current: attr } = useTools('attribute');
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
        height: '100%',
        pb: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h6">Icon</Typography>
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
          borderBottom: '1px solid #000',
        }}
      >
        <Typography variant="h6">Name:</Typography>
        <Typography>{attr?.name || 'None'}</Typography>
      </Box>
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
        <Typography variant="h6">Description:</Typography>
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
          <Typography variant="h6">Type:</Typography>
          <Typography variant="body1">
            {attr?.positive ? 'Positive' : 'Negative' || 'None'}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#ccc' }}>
        {' '}
        BALANCE{' '}
      </Divider>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <Typography variant="h6">Max Per Level:</Typography>
        <Typography>{attr?.balance?.maxPerLevel}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <Typography variant="h6">Health Per Level:</Typography>
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
        <Typography variant="h6">Cost Per Level:</Typography>
        <Typography>{attr?.balance?.costPerLevel}</Typography>
      </Box>
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#ccc' }}>
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
          <Typography variant="h6">
            {attr.settlementPointCost.data[id].name.charAt(0).toUpperCase() +
              attr.settlementPointCost.data[id].name.slice(1)}
            :
          </Typography>
          <Typography>
            <strong>{attr.settlementPointCost.data[id].value}</strong>
          </Typography>
        </Box>
      ))}
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#ccc' }}>
        THRESHOLDS
      </Divider>
      <Box
        sx={{
          gridColumn: 'span 3',
          gap: 2,
          display: 'grid',
          gridTemplateRows: 'repeat(7, 1fr)',
          gridAutoFlow: 'column',
        }}
      >
        {attr.thresholds.order.map((id) => (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'start',
              maxWidth: '15rem',
            }}
            key={id}
          >
            {attr.thresholds.data[id].name && (
              <>
                <Typography
                  variant="h6"
                  sx={{ width: '75%', textAlign: 'start' }}
                >
                  {attr.thresholds.data[id].name.charAt(0).toUpperCase() +
                    attr.thresholds.data[id].name.slice(1)}
                  :
                </Typography>
                <Typography sx={{ width: '25%' }}>
                  <strong>{attr.thresholds.data[id].max}</strong>
                </Typography>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PreviewAttribute;
