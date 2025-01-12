import React, { useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Switch,
  Typography,
  TableContainer,
  Paper,
} from '@mui/material';

const attributeTags = {
  flammable: {
    enabled: false,
    tooltip: 'Vulnerable to fire.',
    eventTags: [
      {
        name: 'Fire',
        description: 'Events which involve fire or burning.',
        weight: 1,
      },
      {
        name: 'Arson',
        description: 'Events which involve intentional fire damage.',
        weight: 0.75,
      },
    ],
  },
  durable: {
    enabled: false,
    tooltip: 'Resistant to damage or wear.',
    eventTags: [
      {
        name: 'Infrastructure',
        description:
          'Events which affect the durability of structures or resources.',
        weight: 1,
      },
      {
        name: 'Maintenance',
        description:
          'Events which require upkeep or repair of structures or resources.',
        weight: 1,
      },
    ],
  },
  perishable: {
    enabled: false,
    tooltip: 'Degrades over time without proper storage.',
    eventTags: [
      {
        name: 'Famine',
        description:
          'A shortage of food or other perishable resources consumed for survival.',
        weight: 1,
      },
      {
        name: 'Spoilage',
        description: 'A loss of resources due to improper storage or handling.',
        weight: 1,
      },
    ],
  },
  valuable: {
    enabled: false,
    tooltip: 'High worth; a frequent target for theft or trade.',
    eventTags: [
      {
        name: 'Theft',
        description: 'Events which involve the loss of valuable resources.',
        weight: 1,
      },
      {
        name: 'Trade',
        description: 'Events which involve the exchange of valuable resources.',
        weight: 1,
      },
    ],
  },
  renewable: {
    enabled: false,
    tooltip: 'Can replenish naturally over time.',
    eventTags: [
      {
        name: 'Harvest',
        description:
          'Events which involve the collection of renewable resources.',
        weight: 1,
      },
      {
        name: 'Replanting',
        description:
          'Events which involve the restoration of renewable resources.',
        weight: 1,
      },
    ],
  },
  scarce: {
    enabled: false,
    tooltip: 'Difficult to obtain or maintain in this region.',
    eventTags: [
      {
        name: 'Scarcity',
        description: 'Events which involve a shortage of scarce resources.',
        weight: 1,
      },
      {
        name: 'Rationing',
        description:
          'Events which involve the controlled distribution of scarce resources.',
        weight: 1,
      },
      {
        name: 'Surplus',
        description: 'Events which involve an excess of scarce resources.',
        weight: 0.5,
      },
    ],
  },
  agricultural: {
    enabled: false,
    tooltip: 'Tied to farming or rural industries.',
    eventTags: [
      {
        name: 'Harvest',
        description:
          'Events which involve the collection of agricultural resources.',
        weight: 1,
      },
      {
        name: 'Planting',
        description:
          'Events which involve the cultivation of agricultural resources.',
        weight: 1,
      },
    ],
  },
  industrial: {
    enabled: false,
    tooltip: 'Related to manufacturing or heavy labor.',
    eventTags: [
      {
        name: 'Industrial Accident',
        description:
          'Events which involve the loss of life or resources due to industrial activity.',
        weight: 1,
      },
      {
        name: 'Labor Shortage',
        description: 'Events which involve a lack of ready or willing workers',
        weight: 1,
      },
    ],
  },
  arcane: {
    enabled: false,
    tooltip: 'Linked to magic or the supernatural.',
    eventTags: [
      {
        name: 'Magic',
        description: 'Events which involve the use of arcane resources.',
        weight: 1,
      },
      {
        name: 'Curses',
        description:
          'Events which involve the misuse or backlash of arcane resources.',
        weight: 1,
      },
    ],
  },
  religious: {
    enabled: false,
    tooltip: 'A resource important to faith or rituals.',
    eventTags: [
      {
        name: 'Religious Ceremony',
        description: 'Events which involve the use of religious resources.',
        weight: 1,
      },
      {
        name: 'Sacrifice',
        description: 'Events which involve the loss of religious resources.',
        weight: 1,
      },
    ],
  },
  exotic: {
    enabled: false,
    tooltip: 'Uncommon or unique to the region.',
    eventTags: [
      {
        name: 'Exotic Trade',
        description:
          'Events which involve the exchange of rare or unique resources.',
        weight: 1,
      },
      {
        name: 'Discovery',
        description:
          'Events which involve the identification of rare or unique resources.',
        weight: 1,
      },
    ],
  },
  edible: {
    enabled: false,
    tooltip: 'Can be consumed for survival.',
    eventTags: [
      {
        name: 'Feast',
        description:
          'Events which involve the consumption of edible resources.',
        weight: 1,
      },
      {
        name: 'Famine',
        description:
          'A shortage of food or other perishable resources consumed for survival.',
        weight: 1,
      },
      {
        name: 'Plague',
        description: 'Events which involve the spread of disease.',
        weight: 1,
      },
    ],
  },
  toxic: {
    enabled: false,
    tooltip: 'Harmful if improperly handled or consumed.',
    eventTags: [
      {
        name: 'Poisoning',
        description:
          'Events which involve the harmful effects of toxic resources.',
        weight: 1,
      },
      {
        name: 'Contamination',
        description: 'Events which involve the spread of toxic resources.',
        weight: 1,
      },
    ],
  },
  strategic: {
    enabled: false,
    tooltip: 'Important in warfare or diplomacy.',
    eventTags: [
      {
        name: 'War',
        description: 'Events which involve the use of strategic resources.',
        weight: 1,
      },
      {
        name: 'Diplomacy',
        description: 'Events which involve the use of strategic resources.',
        weight: 1,
      },
    ],
  },
  contested: {
    enabled: false,
    tooltip: 'Frequently the focus of disputes or events.',
    eventTags: [
      {
        name: 'Conflict',
        description: 'Events which involve the use of contested resources.',
        weight: 1,
      },
      {
        name: 'Dispute',
        description: 'Events which involve the use of contested resources.',
        weight: 1,
      },
    ],
  },
};

const attributeTagsTwo = {
  food: {
    tags: {
      perishable: {},
      renewable: {},
      scarce: {},
      morale: {},
    },
  },
  shelter: {
    tags: {
      morale: {},
      'decay-prone': {},
      'population dependent': {},
      flammable: {},
      defensive: {},
    },
  },
  'medical capacity': {
    tags: {
      scarce: {},
      medical: {},
      perishable: {},
      'population dependent': {},
    },
  },
  'defensive infrastructure': {
    tags: {
      'decay-prone': {},
      defensive: {},
      strategic: {},
    },
  },
  intelligence: {
    tags: {
      strategic: {},
      espionage: {},
      valuable: {},
    },
  },
  garrison: {
    tags: {
      defensive: {},
      military: {},
      strategic: {},
    },
  },
  trade: {
    tags: {
      commerce: {},
      valuable: {},
      strategic: {},
    },
  },
  craftsmanship: {
    tags: {
      commerce: {},
      'population-dependent': {},
      industrial: {},
    },
  },
  culture: {
    tags: {
      'population-dependent': {},
      religious: {},
      morale: {},
    },
  },
  supplies: {
    tags: {
      commerce: {},
      flammable: {},
      scarce: {},
      valuable: {},
    },
  },
  'labor pool': {
    tags: {
      'population-dependent': {},
      morale: {},
      industrial: {},
    },
  },
};

const sections = {
  'Resource Properties': [
    'flammable',
    'durable',
    'perishable',
    'valuable',
    'renewable',
    'scarce',
  ],
  'Thematic Tags': [
    'agricultural',
    'industrial',
    'arcane',
    'religious',
    'exotic',
  ],
  'Situational Tags': ['edible', 'toxic', 'strategic', 'contested'],
};

const AttributeTagsTable = () => {
  const [tags, setTags] = useState(attributeTags);

  const toggleTag = (key) => {
    setTags((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  return (
    <Box
      sx={{
        padding: 2,
        boxShadow: 4,
        borderRadius: 4,
        backgroundColor: 'background.default',
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: '340px',
          overflow: 'auto',
          boxShadow: 0,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'background.default' }}>
                <Typography variant="h6">Category</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'background.default' }}>
                <Typography variant="h6">Tag</Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: 'background.paper' }}
              >
                <Typography variant="h6">Enabled</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(sections).map(([section, keys]) => (
              <React.Fragment key={section}>
                {/* Section Header */}
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{
                      position: 'sticky',
                      top: 40, // Adjust based on header height
                      zIndex: 1,
                      fontWeight: 'bold',
                      backgroundColor: 'secondary.main',
                      color: 'common.white',
                    }}
                  >
                    <Typography variant="h6">{section}</Typography>
                  </TableCell>
                </TableRow>
                {/* Section Tags */}
                {keys.map((key, index) => (
                  <TableRow
                    key={key}
                    sx={{
                      backgroundColor: (theme) =>
                        index % 2 === 0
                          ? theme.palette.divider
                          : theme.palette.background.default,
                    }}
                  >
                    <TableCell></TableCell>
                    <TableCell>
                      <Tooltip title={tags[key].tooltip} arrow>
                        <span>
                          <strong>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </strong>
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={tags[key].enabled}
                        onChange={() => toggleTag(key)}
                        color="secondary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttributeTagsTable;
