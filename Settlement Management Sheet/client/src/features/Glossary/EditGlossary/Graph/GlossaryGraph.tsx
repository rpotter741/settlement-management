import { Box } from '@mui/material';
import GlossaryMainWrapper from '../components/GlossaryMainWrapper.js';

/* Think Obsidian graph view. But... less sexy. Or more sexy. I can't decide. And won't know til later. */

const GlossaryGraph = () => {
  //
  return (
    <GlossaryMainWrapper>
      I'm a Glossary Graph!
      <Box>
        I don't have any friends!
        <Box>
          At least I can be honest about it!
          <Box>And there's no Prettier collapse, so we're all winning!</Box>
        </Box>
      </Box>
    </GlossaryMainWrapper>
  );
};

export default GlossaryGraph;
