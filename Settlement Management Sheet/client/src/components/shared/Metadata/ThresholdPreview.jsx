import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ThresholdPreview = ({ threshold, even }) => {
  const test = threshold.name !== '';
  return test ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'start',
        transition: 'top 0.3s ease, left 0.3s ease',
        gap: 2,
        backgroundColor: even ? 'background.default' : 'background.paper',
      }}
    >
      <Typography sx={{ width: '66%', textAlign: 'left' }}>
        {threshold.name}:
      </Typography>
      <Typography>{threshold.max}</Typography>
    </Box>
  ) : null;
};

const PreviewThresholds = ({ data, order }) => {
  return (
    <Box
      sx={{
        gridColumn: 'span 3',
        // gap: 2,
        display: 'grid',
        gridTemplateRows: 'repeat(7, 1fr)',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridAutoFlow: 'column',
      }}
    >
      {order.map((id, n) => {
        const threshold = data[id];
        return (
          <ThresholdPreview
            key={id}
            threshold={threshold}
            sx={{ gridColumn: 'span 3' }}
            even={n % 2 === 0}
          />
        );
      })}
    </Box>
  );
};

export default PreviewThresholds;
