import React from 'react';
import { ArrowBack, ArrowForward, Search, Tune } from '@mui/icons-material';
import {
  Box,
  Button,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import pageRoutes from '../routes.js';
import { useSelector } from 'react-redux';
import { panelOpen } from '@/app/selectors/panelSelectors.js';
import TabNumberAndNav from './widgets/TabNumberAndNav.js';
import { useMediaQuery } from '@mui/system';
import ProgressRail from '@/features/ProgressRail/ProgressRail.tsx';

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showNumbers = location.pathname !== '/customCreation';

  const sideBarOpen = useSelector(panelOpen);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        maxHeight: 48,
        borderBottom: '1px solid',
        borderColor: 'primary.dark',
      }}
    >
      <Box
        role="separator"
        sx={{
          width: '100px',
          transition: 'width 0.3s ease',
        }}
      />
      <ProgressRail queue={1} />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          my: 1,
        }}
      >
        <TextField
          size="small"
          placeholder="Search..."
          sx={{ maxWidth: 450, my: 1, width: '100%' }}
          slotProps={{
            input: {
              startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            ml: 2,
          }}
        >
          <TabNumberAndNav side="left" disabled={false} hide={false} />
          <TabNumberAndNav
            side="right"
            disabled={useMediaQuery('(max-width:1536px)')}
            hide={false}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TopNav;
