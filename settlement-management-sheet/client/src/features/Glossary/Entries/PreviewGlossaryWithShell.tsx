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
  region: [],
  nation: [
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
  territory: [],
  landmark: ['region', 'climate', 'type'],
  settlement: [],
  collective: [],
  location: ['terrain', 'climate', 'type', 'region'],
  person: [],
  event: [],
  lore: [],
};

const PreviewGlossaryWithShell: React.FC = () => {
  const { entry, node } = useShellContext();
  const { entryType }: { entryType: string } = node;

  return (
    <Box
      sx={{
        display: 'grid',
        height: '100%',
        width: '100%',
        gridTemplateColumns: '2fr 1fr',
      }}
    >
      <Box
        sx={{
          width: '100%',
          py: 2,
          // borderLeft: '1px solid',
          borderColor: 'divider',
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
