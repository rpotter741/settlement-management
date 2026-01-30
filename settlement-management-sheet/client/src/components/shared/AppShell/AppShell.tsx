import React from 'react';
import { Box, Button } from '@mui/material';
import TopNav from './TopNav/TopNav.js';
import GlobalModal from './GlobalModal.js';
import { AnimatePresence } from 'framer-motion';
import SidebarOrchestrator from './SidebarOrchestrator.js';
import store from '@/app/store.ts';
import sysSubTypeCommands from '@/app/commands/sysSubtype.ts';
import { dispatch } from '@/app/constants.ts';
import { addSubTypePropertyThunkRoot } from '@/app/thunks/glossary/subtypes/properties/addSubTypePropertyThunk.ts';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = store.getState();
  const user = state.user;
  return (
    <>
      <TopNav />
      <Box
        className="app-shell-container"
        sx={{
          display: 'flex',
          height: 'calc(100vh)',
          width: 'calc(100vw)',
          overflowY: 'hidden',
          overflowX: 'hidden',
          minWidth: 800,
        }}
      >
        {/* width: 348px */}
        <SidebarOrchestrator />
        {/* it's magic, baby! */}
        <GlobalModal />
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </Box>
    </>
  );
};

export default AppShell;
