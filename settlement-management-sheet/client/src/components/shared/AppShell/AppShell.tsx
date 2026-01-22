import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import TopNav from './TopNav/TopNav.js';
import GlobalModal from './GlobalModal.js';
import { AnimatePresence } from 'framer-motion';
import SidebarOrchestrator from './SidebarOrchestrator.js';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
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
