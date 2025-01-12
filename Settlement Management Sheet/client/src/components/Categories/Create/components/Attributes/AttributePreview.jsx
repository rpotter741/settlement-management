import React, { useState } from 'react';
import {
  Box,
  Divider,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';

const AttributePreview = ({ attribute, setPreview }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: 'common.white',
        p: 4,
        boxShadow: 4,
        borderRadius: 4,
      }}
    >
      <Typography variant="body1" sx={{ width: '100%', textAlign: 'start' }}>
        <strong>Cost Per Level:</strong> {attribute.costPerLevel}
      </Typography>
      <Typography variant="body1" sx={{ width: '100%', textAlign: 'start' }}>
        <strong>Max Per Level:</strong> {attribute.values.maxPerLevel}
      </Typography>

      <Typography
        variant="body1"
        sx={{ width: '100%', textAlign: 'start', height: '4rem' }}
      >
        <strong>Description:</strong>{' '}
        {attribute.description.length > 70 ? (
          <>{attribute.description.slice(0, 70)}...</>
        ) : (
          attribute.description
        )}
      </Typography>
      <Divider textAlign="center">
        <Typography>
          <strong>Settlement Point Costs</strong>
        </Typography>
      </Divider>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr 1fr'],
          gap: 2,
        }}
      >
        {Object.entries(attribute.settlementPointCost).map(([type, cost]) => (
          <Typography
            key={type}
            variant="body1"
            sx={{ width: '50%', textAlign: 'start' }}
          >
            <strong>{type[0].toUpperCase() + type.slice(1)}:</strong> {cost}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default AttributePreview;
