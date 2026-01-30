import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import React from 'react';

const MotionBox = motion(Box);

interface BookPanelProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const BookPanel: React.FC<BookPanelProps> = ({ isOpen, children }) => {
  return (
    <MotionBox
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={{
        open: {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
        closed: {
          rotateY: -90,
          opacity: 0,
          scale: 0.95,
          transition: {
            duration: 0.4,
            ease: [0.55, 0.085, 0.68, 0.53],
          },
        },
      }}
      sx={{
        transformOrigin: 'left center',
        perspective: 1000,
        backfaceVisibility: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        bgcolor: 'background.paper',
        boxShadow: 6,
        borderRadius: 3,
        overflow: 'hidden',
        zIndex: 1300, // or whatever fits your layer stack
      }}
    >
      {children}
    </MotionBox>
  );
};

export default BookPanel;
