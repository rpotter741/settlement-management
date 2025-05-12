import React from 'react';

import { Box, Button, Typography, Divider } from '@mui/material';

import { useTools } from 'hooks/useTool.jsx';
import { useToolContext } from 'context/ToolContext.jsx';

import DataDisplay from 'components/shared/Metadata/NameDisplay.jsx';
import useFetchReferences from 'hooks/useFetchReferences.jsx';
import AttributeCard from 'components/shared/AttributeCard/AttributeCard.tsx';
import PreviewThresholds from 'components/shared/Metadata/ThresholdPreview.jsx';
import PreviewDependencies from 'components/shared/Metadata/PreviewDependencies.jsx';

const PreviewCategory = () => {
  const { tool, id } = useToolContext();
  const { current: category } = useTools(tool, id);
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
        type="body1"
      />
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
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#000' }}>
        ATTRIBUTES
      </Divider>
      {attributes.map((attr) => (
        <AttributeCard key={attr.refId} attr={attr} />
      ))}
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#000' }}>
        THRESHOLDS
      </Divider>
      <PreviewThresholds
        data={category?.thresholds?.data}
        order={category?.thresholds?.order}
        innerSx={{ gridColumn: 'span 3' }}
      />
      <Divider sx={{ gridColumn: 'span 3', borderColor: '#000' }}>
        DEPENDENCIES
      </Divider>
      {category?.dependencies?.order.map((id) => (
        <Box
          key={id}
          sx={{
            gridColumn: 'span 1',
            display: 'flex',
            flexDirection: 'column',
            display: 'grid',
            gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
            gap: 2,
          }}
        >
          <PreviewDependencies
            data={category.dependencies.data[id].thresholds}
            name={category.dependencies.data[id].name}
          />
        </Box>
      ))}
    </Box>
  );
};

export default PreviewCategory;
