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
        borderBottom: '1px solid',
        borderColor: 'primary.dark',
      }}
    >
      <Box
        role="separator"
        sx={{
          width: '348px',
          transition: 'width 0.3s ease',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          my: 1,
        }}
      >
        {/* <Select
          sx={{ width: 300, p: 0 }}
          variant="standard"
          value={location.pathname}
          onChange={(e) => navigate(e.target.value)}
          renderValue={(value) => {
            const route = pageRoutes.find((r) => r.path === value);
            return route ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'start',
                  ml: 2,
                }}
              >
                <Icon sx={{ fontSize: '1.5rem' }}>{route.icon}</Icon>
                <Typography variant="body2">{route.label}</Typography>
              </Box>
            ) : (
              'Select Page'
            );
          }}
        >
          {pageRoutes.map((route) => {
            return route.sidebarNav ? (
              <MenuItem
                key={route.path}
                value={route.path}
                // onClick={() => navigate(route.path)}
                sx={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Icon fontSize="small">{route.icon}</Icon>
                <Typography variant="body2">{route.label}</Typography>
              </MenuItem>
            ) : null;
          })}
        </Select> */}
        <TextField
          size="small"
          placeholder="Search..."
          sx={{ width: 450, my: 1 }}
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
