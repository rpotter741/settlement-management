import { Box, Typography } from '@mui/material';
import { DependencyThreshold } from './Dependency.js';
import React from 'react';

interface DependencyPreviewProps {
  threshold: DependencyThreshold;
  style?: React.CSSProperties;
}

const DependencyPreview: React.FC<DependencyPreviewProps> = ({
  threshold,
  style,
}) => {
  const test = threshold.name !== '';
  return test ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'start',
        transition: 'top 0.3s ease, left 0.3s ease',
        gap: 2,
        ...style,
      }}
    >
      <Typography sx={{ width: '66%', textAlign: 'left' }}>
        {threshold.name}:
      </Typography>
      <Typography>{threshold.modifier}</Typography>
    </Box>
  ) : null;
};

interface PreviewDependenciesProps {
  data: DependencyThreshold[];
  name: string;
}

const PreviewDependencies: React.FC<PreviewDependenciesProps> = ({
  data,
  name,
}) => {
  return (
    <Box
      sx={{
        gridColumn: 'span 3',
        display: 'grid',
        gridTemplateRows: `repeat(${data.length + 1}, 1fr)`,
        gridAutoFlow: 'column',
      }}
    >
      <Typography
        variant="body1"
        sx={{
          textAlign: 'left',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          pl: '25%',
        }}
      >
        {name}
      </Typography>
      {data.map((thresh, n) => (
        <DependencyPreview
          key={thresh.name}
          threshold={thresh}
          style={{
            backgroundColor:
              n % 2 === 0 ? 'background.paper' : 'background.default',
          }}
        />
      ))}
    </Box>
  );
};

export default PreviewDependencies;
