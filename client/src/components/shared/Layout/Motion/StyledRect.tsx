import { alpha, styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Create a styled rect that can access theme props
const SuccessStyledRect = styled(motion.rect)(({ theme }) => ({
  stroke: alpha(theme.palette.success.main, 0.5),
  strokeWidth: 2,
  fill: 'none',
  rx: 8,
  ry: 8,
}));

export { SuccessStyledRect };
