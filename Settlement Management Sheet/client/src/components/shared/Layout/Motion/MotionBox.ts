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

export default MotionBox;
