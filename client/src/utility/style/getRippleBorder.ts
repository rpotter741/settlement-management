import { alpha, Theme } from '@mui/material';
import { pulseBorder } from './pulseBorder.js';

export type Palette =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

export const getRippleBorder = (
  theme: Theme,
  color: Palette = 'primary',
  alphaValue: number = 0.5
) => ({
  animation: `${pulseBorder} 0.15s ease-out`,
  boxShadow: `0 0 0 2px ${alpha(theme.palette[color].main, alphaValue)}`,
});

export default getRippleBorder;
