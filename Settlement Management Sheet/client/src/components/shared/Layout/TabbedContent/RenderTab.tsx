import React from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/system';
import MotionBox from '../Motion/MotionBox.js';

interface TabPanelProps {
  children: React.ReactNode;
  activeTab: string;
  tabName: string;
  columns: number;
  index?: number;
  lastIndex?: number;
}

const TabPanel: React.FC<TabPanelProps> = React.memo(
  ({ children, activeTab, tabName, columns, index = 0, lastIndex = 0 }) => {
    const isActive = activeTab === tabName;
    const sameIndex = index === lastIndex;
    if (!isActive) return null;

    const direction = index > lastIndex ? 1 : -1;

    return sameIndex ? (
      <Box
        id={`tab-panel-${tabName}`}
        sx={{
          height: '90%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gridColumn: `span ${columns}`,
        }}
      >
        {children}
      </Box>
    ) : (
      <AnimatePresence mode="wait">
        <MotionBox
          id={`tab-panel-${tabName}`}
          key={tabName}
          initial={{ x: direction * 100 + '%', opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: -direction * 100 + '%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          sx={{
            gridColumn: `span ${columns}`,
            height: '90%',
          }}
        >
          {children}
        </MotionBox>
      </AnimatePresence>
    );
  }
);

export default TabPanel;
