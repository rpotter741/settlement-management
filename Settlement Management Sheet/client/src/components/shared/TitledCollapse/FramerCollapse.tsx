import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

interface FramerCollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  onCloseComplete?: () => void;
  direction?: 'up' | 'down' | 'left' | 'right' | 'shrink';
  withOpacity?: boolean;
  duration?: number;
  easing?: string; // e.g. 'easeInOut', 'easeOut', 'anticipate'
}

const StyledMotionDiv = styled(motion.div)(() => ({
  overflow: 'hidden',
}));

const getVariants = (
  direction: FramerCollapseProps['direction'],
  withOpacity: boolean
) => {
  const common = withOpacity ? { opacity: 0 } : {};

  switch (direction) {
    case 'up':
      return {
        initial: { height: 0, ...common },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, ...common },
      };
    case 'down':
      return {
        initial: { height: 0, ...common },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, ...common },
      };
    case 'left':
      return {
        initial: { width: 0, ...common },
        animate: { width: '100%', opacity: 1 },
        exit: { width: 0, ...common },
      };
    case 'right':
      return {
        initial: { width: 0, ...common },
        animate: { width: '100%', opacity: 1 },
        exit: { width: 0, ...common },
      };
    case 'shrink':
      return {
        initial: { scale: 0.95, ...common },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, ...common },
      };
    default:
      return {
        initial: { height: 0, ...common },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, ...common },
      };
  }
};

const FramerCollapse: React.FC<FramerCollapseProps> = ({
  isOpen,
  children,
  onCloseComplete,
  direction = 'down',
  withOpacity = true,
  duration = 0.3,
  easing = 'easeInOut',
}) => {
  const handleExitComplete = () => {
    onCloseComplete?.();
  };

  return (
    <AnimatePresence initial={false} onExitComplete={handleExitComplete}>
      {isOpen && (
        <StyledMotionDiv
          key="framer-collapse"
          variants={getVariants(direction, withOpacity)}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration, ease: easing }}
        >
          {children}
        </StyledMotionDiv>
      )}
    </AnimatePresence>
  );
};

export default FramerCollapse;
