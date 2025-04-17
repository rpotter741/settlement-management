import { Box, Typography, Card, Button, Divider } from '@mui/material';
import { useState } from 'react';
import changeIconDimensions from 'utility/halveIconDimensions.js';

import Icon from 'components/shared/Icons/Icon.jsx';

const AttributeCard = ({ attr }) => {
  return (
    <Card sx={{ py: 4, boxShadow: 3, backgroundColor: 'background.default' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {attr.name}
        </Typography>
        <Icon
          viewBox={changeIconDimensions(attr.icon.viewBox, 0.75)}
          path={attr.icon.d}
          size={40}
          color={attr.iconColor}
        />
      </Box>
      <Divider sx={{ fontSize: '0.75rem' }}>Per Level</Divider>
      <Typography variant="body2" sx={{ textAlign: 'left', pl: 2 }}>
        Max: {attr.balance.maxPerLevel}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'left', pl: 2 }}>
        Cost: {attr.balance.costPerLevel}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'left', pl: 2 }}>
        Health: {attr.balance.healthPerLevel}
      </Typography>
      <Divider sx={{ fontSize: '0.75rem' }}>Description</Divider>
      <Typography variant="body2" sx={{ textAlign: 'center', px: 2 }}>
        {attr.description}
      </Typography>
    </Card>
  );
};

export default AttributeCard;
