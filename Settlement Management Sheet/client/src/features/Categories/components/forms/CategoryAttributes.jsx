import { useEffect } from 'react';
import { useTools } from 'hooks/useTool.jsx';

import { Box, Typography, Button } from '@mui/material';

const CategoryAttributes = () => {
  const { current, edit, updateTool, validateToolField } = useTools('category');

  useEffect(() => {
    console.log(edit);
  }, [edit]);

  return (
    <Box>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
        {edit.attributes.map((attr) => (
          <Box key={attr}>{attr}</Box>
        ))}
        {edit.attributes.length < 6 && <Button>Add Attribute</Button>}
      </Typography>
    </Box>
  );
};

export default CategoryAttributes;
