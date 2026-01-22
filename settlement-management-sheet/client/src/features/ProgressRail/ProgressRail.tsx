import { Box, Typography } from '@mui/material';

const ProgressRail = ({ queue }: { queue: number }) => {
  //
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: queue > 0 ? '240px' : '0px',
        width: queue > 0 ? '240px' : '0px',
        maxHeight: '40px',
        minHeight: '40px',
        border: 1,
        borderRadius: 2,
        borderColor: 'primary.dark',
        opacity: queue > 0 ? 1 : 0,
        transition: 'opacity 0.3s ease, width 0.3s ease, min-width 0.3s ease',
      }}
    >
      <Typography variant="caption">Updating something...</Typography>
      <Typography variant="caption">[|||||||-------]</Typography>
    </Box>
  );
};

export default ProgressRail;
