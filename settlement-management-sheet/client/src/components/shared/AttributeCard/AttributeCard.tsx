import { Box, Typography, Card, Collapse, Divider, Chip } from '@mui/material';
import React, { useState } from 'react';
import changeIconDimensions from '../../../utility/changeIconDimensions.js';

import Icon from '../Icons/Icon.jsx';

export interface AttrCard {
  name: string;
  iconColor: string;
  icon: {
    d: string;
    fill: string;
    viewBox: string;
    color: string;
    backgroundColor?: string; // Optional, for card mode
    name?: string; // Optional, for card mode
  };
  description: string;
  balance: {
    maxPerLevel: number;
    costPerLevel: number;
    healthPerLevel: number;
  };
  [key: string]: any;
}

interface AttributeCardProps {
  attr: AttrCard;
}

const AttributeCard: React.FC<AttributeCardProps> = ({ attr }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card
      sx={{
        pb: 4,
        boxShadow: 3,
        backgroundColor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          minHeight: 100,
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {attr.name}
        </Typography>
        <Icon
          viewBox={changeIconDimensions(attr.icon.viewBox, 1)}
          path={attr.icon.d}
          size={40}
          color={attr.icon.color}
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
      <Divider>
        <Chip
          sx={{
            backgroundColor: 'background.default',
            color: 'primary.main',
          }}
          label={expanded ? 'Hide Description' : 'Show Description'}
          size="small"
          onClick={() => setExpanded((prev) => !prev)}
        />
      </Divider>
      <Collapse in={expanded}>
        <Typography variant="body2" sx={{ textAlign: 'center', px: 2 }}>
          {attr.description}
        </Typography>
      </Collapse>
    </Card>
  );
};

export default AttributeCard;
