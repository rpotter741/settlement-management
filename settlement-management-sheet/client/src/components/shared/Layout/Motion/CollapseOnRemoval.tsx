import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface CollapseOnRemovalProps {
  children: React.ReactNode;
  show?: boolean;
  duration?: number;
  sx?: Record<string, any>;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
}

const MotionBox = styled(motion.div)({});

const CollapseOnRemoval: React.FC<CollapseOnRemovalProps> = ({
  children,
  show = true,
  duration = 0.3,
  sx = {},
  onMouseLeave = () => {},
  onMouseEnter = () => {},
}) => (
  <AnimatePresence>
    {show && (
      <MotionBox
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration }}
        style={{ overflow: 'hidden', marginBottom: '0.5rem' }}
        sx={sx}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </MotionBox>
    )}
  </AnimatePresence>
);

export default CollapseOnRemoval;
