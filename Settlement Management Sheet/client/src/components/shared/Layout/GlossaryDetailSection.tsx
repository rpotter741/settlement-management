import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { capitalize } from 'lodash';
import GlossaryDetail from '@/components/shared/Layout/GlossaryDetail.js';
import {
  backLinkOrder,
  entryTypeIcons,
} from '@/features/Glossary/helpers/glossaryTypeIcon.js';
import { useShellContext } from '@/context/ShellContext.js';

interface GlossaryDetailSectionProps {
  keypathArray: string[];
}

const keypathToHeader: Record<string, string> = {
  nations: 'Nations',
  regions: 'Regions',
  locations: 'Locations',
  resources: 'Resources',
  population: 'Population',
  climate: 'Climate',
  terrain: 'Terrain',
  capital: 'Capital',
  languages: 'Languages',
  persons: 'Persons',
  eventLog: 'Event Log',
  geography: 'Geography',
  type: 'Type',
  region: 'Regions',
  landmark: 'Landmark',
  settlement: 'Settlement',
  faction: 'Faction',
  person: 'Person',
  event: 'Event',
  note: 'Note',
};

const GlossaryDetailSection: React.FC<GlossaryDetailSectionProps> = ({
  keypathArray,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        p: 2,
        borderLeft: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'primary.main',
          flexWrap: 'wrap',
        }}
      >
        {backLinkOrder.map((type) => {
          const number = (Math.random() * (10 * Math.random())).toFixed(0);
          const plurality = number === '1' ? 'Backlink' : 'Backlinks';
          if (Number(number) < 1) return null;
          return (
            <Tooltip
              key={type}
              title={`${number} ${capitalize(type)} ${plurality}`}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 1,
                  cursor: 'pointer',
                }}
              >
                {entryTypeIcons[type]}
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  ({number})
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      {keypathArray.map((keypath) => (
        <GlossaryDetail
          key={keypath}
          keypath={keypath}
          header={keypathToHeader[keypath]}
        />
      ))}
    </Box>
  );
};

export default GlossaryDetailSection;
