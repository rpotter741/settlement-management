import { useShellContext } from '@/context/ShellContext.js';
import { Box } from '@mui/system';
import { Grid2 as Grid, Tooltip, Typography } from '@mui/material';
import React from 'react';
import ReadOnlyView from '@/components/shared/TipTap/ReadOnlyView.js';
import GlossaryDetailSection from '@/components/shared/Layout/GlossaryDetailSection.js';
import { GlossaryEntryType } from 'types/index.js';

const keypathArray: Record<NonNullable<GlossaryEntryType>, string[]> = {
  continent: [
    'nations',
    'regions',
    'locations',
    'resources',
    'population',
    'climate',
    'terrain',
  ],
  territory: [],
  domain: [
    'continent',
    'regions',
    'capital',
    'population',
    'languages',
    'persons',
    'eventLog',
    'locations',
    'geography',
  ],
  province: [],
  landmark: ['region', 'climate', 'type'],
  settlement: [],
  faction: [],
  location: ['terrain', 'climate', 'type', 'region'],
  person: [],
  event: [],
  note: [],
};

const PreviewGlossaryWithShell: React.FC = () => {
  const { entry, node } = useShellContext();
  const { entryType }: { entryType: string } = node;

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      <Box
        sx={{
          width: '66.6667%',
          py: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h2" sx={{ mb: 2 }}>
          {entry.name}
        </Typography>
        <ReadOnlyView content={entry.description} />
      </Box>
      <GlossaryDetailSection
        keypathArray={keypathArray[entryType as NonNullable<GlossaryEntryType>]}
      />
    </Box>
  );
};

export default PreviewGlossaryWithShell;
