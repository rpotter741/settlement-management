import { Box, Typography } from '@mui/material';

const NameNewTemplate = () => {
  //
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ width: '100%', textAlign: 'center' }}
      >
        Name New Template
      </Typography>
      {/* Additional form fields and buttons would go here */}
    </Box>
  );
};

export default NameNewTemplate;
