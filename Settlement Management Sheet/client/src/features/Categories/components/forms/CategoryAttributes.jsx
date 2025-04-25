import { useEffect } from 'react';
import { useTools } from 'hooks/useTool.jsx';

import { Box, Typography, Button } from '@mui/material';

import AttributeCard from 'components/shared/AttributeCard/AttributeCard.jsx';

import useFetchReferences from 'hooks/useFetchReferences.jsx';

const CategoryAttributes = ({ setShowModal, id }) => {
  const { current, edit, updateTool, validateToolField } = useTools(
    'category',
    id
  );
  const attributes = useFetchReferences('attribute', edit.attributes);

  const handleAddClick = () => {
    setShowModal('Select Attribute');
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
          }}
        >
          {attributes.map((attr) => (
            <AttributeCard key={attr.refId} attr={attr} />
          ))}
        </Box>
        {edit.attributes.length < 6 && (
          <Button onClick={handleAddClick}>Add Attribute</Button>
        )}
      </Typography>
    </Box>
  );
};

export default CategoryAttributes;
