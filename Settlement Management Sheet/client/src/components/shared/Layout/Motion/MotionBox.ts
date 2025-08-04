import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const MotionBox = styled(motion.div)({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  top: 0,
  left: 0,
  backgroundColor: 'transparent',
});

const RowMotionBox = styled(motion.div)({
  height: '100%',
  width: '100%',
  display: 'flex',
  top: 0,
  left: 0,
  backgroundColor: 'transparent',
});

const RowMotionButton = styled(motion.button)({
  height: '100%',
  width: '100%',
  display: 'flex',
  top: 0,
  left: 0,
  backgroundColor: 'transparent',
});

export { MotionBox as default, MotionBox, RowMotionBox, RowMotionButton };
