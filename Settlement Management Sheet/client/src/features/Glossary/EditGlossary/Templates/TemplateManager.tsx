import { Box, TextField } from '@mui/material';
import GlossaryMainWrapper from '../components/GlossaryMainWrapper.js';
import { useState } from 'react';
import { useRelaySub } from '@/hooks/global/useRelay.js';

const SubTypeManager = () => {
  //
  const [subType, setSubType] = useState<any>(null);
  useRelaySub({
    id: 'subType-editor',
    onComplete: setSubType,
  });

  return (
    <GlossaryMainWrapper>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          position: 'relative',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flex: 1,
          }}
        >
          {subType ? (
            <Box
              sx={{
                height: '100%',
                width: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                p: 4,
              }}
            >
              <TextField
                label="Sub-Type Name"
                sx={{ width: [200, 400, 600], marginBottom: 2 }}
                value={subType.name}
                onChange={(e) =>
                  setSubType({ ...subType, name: e.target.value })
                }
                onBlur={() => {
                  if (subType.name === '') {
                    setSubType({ ...subType, name: 'Untitled SubType' });
                  }
                }}
              />
            </Box>
          ) : (
            <Box>No Sub-Type Selected</Box>
          )}
        </Box>
      </Box>
    </GlossaryMainWrapper>
  );
};

export default SubTypeManager;

/*
We'll have the tabbed display (lol always) with the generic 'groups'. Tabs can be renamed and reordered, and up to 5 can exist. Side panel might have something to do with it, we'll see. Anyway!

Each tab will have a list of properties, each can be named, given an input type, and then have config options depending on the input type.

Definitely going to use sidebar for navigation here so that each one can be easily accessed. There will be a 'preview' mode where they can see what it looks like to the user (probably a toggle in the side bar -- maybe it's width will be adjusted! Thank to the store, that should be pretty easy (maybe 400 instead of 300 -- sorry tablet users)).
*/
