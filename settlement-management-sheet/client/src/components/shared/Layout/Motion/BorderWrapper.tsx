import { Box, useTheme } from '@mui/system';

import { motion } from 'framer-motion';
import { SuccessStyledRect } from './StyledRect.js';

const BorderWrapper = ({
  children,
  isVisible,
  sx,
  duration = 1,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  sx?: object;
  duration?: number;
}) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block', ...sx }}>
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <SuccessStyledRect
          x="1"
          y="1"
          width="98"
          height="98"
          rx="10"
          ry="10"
          fill="none"
          strokeWidth="1"
          pathLength={1}
          initial={{ pathLength: 1 }}
          animate={{ pathLength: 0 }}
          exit={{ pathLength: 1 }}
          transition={{
            duration,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
      {children}
    </Box>
  );
};

export default BorderWrapper;
