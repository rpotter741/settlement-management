import React, { useState } from 'react';

import {
  Box,
  Typography,
  Toolbar,
  List,
  Tooltip,
  Avatar,
  ListItemButton,
  ListItemIcon,
  Divider,
  Collapse,
  IconButton,
  MenuItem,
} from '@mui/material';
import { ulid as newId } from 'ulid';
import { Logout, Settings } from '@mui/icons-material';
import AccountMenu from '@/components/shared/Layout/AvatarWithMenu.js';

const MenuEntry = ({ icon, label, onClick }) => {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <Typography variant="body2">{label}</Typography>
    </ListItemButton>
  );
};

const AccountPanel = () => {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <List>
        <MenuEntry
          icon={<AccountMenu />}
          label="Profile"
          onClick={() => console.log('Profile clicked')}
        />
        <Divider />
        <MenuEntry
          icon={<Settings />}
          label="Settings"
          onClick={() => console.log('Settings clicked')}
        />
        <MenuEntry
          icon={<Logout />}
          label="Logout"
          onClick={() => console.log('Logout clicked')}
        />
      </List>
    </Box>
  );
};

export default AccountPanel;
