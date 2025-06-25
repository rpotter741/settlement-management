import React from 'react';
import { Box, Divider, Chip } from '@mui/material';
import RenderEntry from './RenderEntry.js';
import { v4 as newId } from 'uuid';

const RenderHeader = ({ entry, index, setActive, active, setTool }) => {
  return (
    <Box key={entry.title} sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          minHeight: 36,
          maxHeight: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Divider
          flexItem
          sx={{
            color: 'secondary.main',
            borderColor: 'secondary.main',
            width: '100%',
            px: 2,
          }}
        >
          <Chip
            label={entry.title}
            sx={{
              backgroundColor: 'transparent',
              fontSize: '1rem',
              color: 'secondary.main',
            }}
          />
        </Divider>
      </Box>
      {entry.children.map((child, childIndex) => (
        <RenderEntry
          key={child.title}
          entry={child}
          index={childIndex}
          active={active}
          setActive={setActive}
          setTool={setTool}
        />
      ))}
    </Box>
  );
};

export default RenderHeader;
