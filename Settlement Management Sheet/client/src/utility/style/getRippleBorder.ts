import { Theme } from '@mui/material';
import { pulseBorder } from './pulseBorder.js';

export type Palette =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

export const getRippleBorder = (theme: Theme, color: Palette = 'primary') => ({
  animation: `${pulseBorder} 0.6s ease-out`,
  boxShadow: `0 0 0 2px ${theme.palette[color].main}`,
});

export default getRippleBorder;
