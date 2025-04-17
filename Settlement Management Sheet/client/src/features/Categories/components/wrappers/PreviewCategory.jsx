import React from 'react';

import { Box, Button, Typography, Divider } from '@mui/material';

import { useCategory } from '../../hooks/useCategory.jsx';
import { useTools } from 'hooks/useTool.jsx';

import DataDisplay from 'components/shared/Metadata/NameDisplay.jsx';
import useFetchReferences from 'hooks/useFetchReferences.jsx';
import AttributeCard from 'components/shared/AttributeCard/AttributeCard.jsx';

const PreviewCategory = () => {
  const { current: category } = useTools('category');
  const attributes = useFetchReferences('attribute', category.attributes);
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
      <DataDisplay
        data={category?.name}
        label="Name"
        edit={{ gridColumn: 'span 3' }}
      />
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#000' }} />
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
          {category?.description || 'No description'}
        </Typography>
      </Box>
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#000' }} />
      <Typography
        variant="h5"
        sx={{ gridColumn: 'span 3', textAlign: 'center', my: 2 }}
      >
        Attributes
      </Typography>
      {attributes.map((attr) => (
        <AttributeCard key={attr.refId} attr={attr} />
      ))}
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#000' }} />
      <Typography
        variant="h5"
        sx={{ gridColumn: 'span 3', textAlign: 'center', my: 2 }}
      >
        Thresholds
      </Typography>
      <Box
        sx={{
          gridColumn: 'span 3',
          gap: 2,
          display: 'grid',
          gridTemplateRows: 'repeat(7, 1fr)',
          gridAutoFlow: 'column',
        }}
      >
        {category?.thresholds.order.map((id, n) => (
          <Box
            key={id}
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'start',
              maxWidth: '15rem',
            }}
          >
            <Typography variant="h6">
              {category.thresholds.data[id].name || n}
            </Typography>
          </Box>
        ))}
      </Box>
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#000' }} />
      <Typography
        variant="h5"
        sx={{ gridColumn: 'span 3', textAlign: 'center', my: 2 }}
      >
        Dependencies
      </Typography>
      {category?.dependencies?.order.map((id) => (
        <Box sx={{ gridColumn: 'span 3', display: 'flex', gap: 2 }}>
          <Typography variant="h6">
            {category.dependencies.data[id].name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PreviewCategory;
