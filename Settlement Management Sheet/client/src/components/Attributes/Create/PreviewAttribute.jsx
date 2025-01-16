import React from 'react';

import { Box, Button, Typography, Divider, Switch, Modal } from '@mui/material';

import CustomIcon from '../../utils/Icons/Icon.jsx';

const PreviewAttribute = ({ attr }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'center',
        my: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
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
        <Typography variant="h6">Description</Typography>
        <Typography sx={{ textAlign: 'start' }} variant="body1">
          {attr?.description || 'No description'}
        </Typography>
      </Box>
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#000' }} />
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <Typography variant="h6">Max Per Level:</Typography>
        <Typography>{attr?.values?.maxPerLevel}</Typography>
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
        <Typography>{attr?.healthPerLevel}</Typography>
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
        <Typography>{attr?.costPerLevel}</Typography>
      </Box>
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#ccc' }} />

      <Typography
        variant="h5"
        sx={{ gridColumn: 'span 3', textAlign: 'center', my: 2 }}
      >
        Settlement Point Costs
      </Typography>
      {Object.entries(attr?.settlementPointCost || {}).map(([id, spc]) => (
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
            {spc.name.charAt(0).toUpperCase() + spc.name.slice(1)}:
          </Typography>
          <Typography>{spc.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PreviewAttribute;
