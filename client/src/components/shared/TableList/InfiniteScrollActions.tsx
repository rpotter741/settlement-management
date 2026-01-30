import { Box, IconButton } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';

const InfiniteScrollActions = ({ hasNextPage, fetchNextPage }) => {
  return (
    <Box sx={{ flexShrink: 0, ml: 2 }}>
      <IconButton onClick={() => fetchNextPage()} disabled={!hasNextPage}>
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

export default InfiniteScrollActions;
