import * as React from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Tooltip,
  Chip,
  alpha,
} from '@mui/material';
import {
  PersonAdd,
  Settings,
  Logout,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useTheme } from '@/context/ThemeContext.js';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  //@ts-ignore
  const { themeKey, changeThemeTo } = useTheme();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <IconButton
          sx={{ height: 48, width: 48 }}
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            R
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              overflow: 'visible',
              filter: (theme) =>
                theme.palette.mode === 'dark'
                  ? `drop-shadow(0px 2px 8px ${alpha(theme.palette.primary.main, 0.32)})`
                  : 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',

              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 24,
                height: 24,
                ml: -0.5,
                mr: 1,
              },
              ml: '32px',
              width: '300px',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          My account
        </MenuItem>
        <Divider> Preferences </Divider>
        <MenuItem
          onClick={() => {
            handleClose();
            changeThemeTo(themeKey === 'dark' ? 'default' : 'dark');
          }}
        >
          <ListItemIcon>
            {themeKey === 'dark' ? (
              <LightMode fontSize="small" />
            ) : (
              <DarkMode fontSize="small" sx={{ color: 'black' }} />
            )}
          </ListItemIcon>
          {themeKey === 'dark' ? 'Light' : 'Dark'} Mode
        </MenuItem>
        <Divider> System </Divider>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
