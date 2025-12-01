import getRippleBorder from '@/utility/style/getRippleBorder.js';
import { useTheme, alpha, darken, lighten } from '@mui/material/styles';

type ColorType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'background';

type KeyType = 'main' | 'dark' | 'light' | 'default' | 'paper' | 'contrastText';

const useTheming = () => {
  const theme = useTheme();

  const themeMode = theme.palette.mode;
  const isDarkMode = themeMode === 'dark';

  const getAlphaColor = ({
    color,
    key,
    opacity,
  }: {
    color: any;
    key: any;
    opacity: number;
    //@ts-ignore
  }) => alpha(theme.palette[color][key], opacity);

  const darkenColor = ({
    color,
    key,
    amount,
  }: {
    color: any;
    key: any;
    amount: number;
  }) => {
    //@ts-ignore
    const colorValue = theme.palette[color][key];
    return darken(colorValue, amount);
  };

  const lightenColor = ({
    color,
    key,
    amount,
  }: {
    color: any;
    key: any;
    amount: number;
  }) => {
    //@ts-ignore
    const colorValue = theme.palette[color][key];
    return lighten(colorValue, amount);
  };

  const getBorderRipple = ({
    color = 'primary',
    alphaValue = 0.5,
  }: {
    color?: any;
    alphaValue?: number;
  }) => getRippleBorder(theme, color, alphaValue);

  const getHexValue = ({ color, key }: { color: any; key: any }) => {
    //@ts-ignore
    return theme.palette[color][key];
  };

  return {
    isDarkMode,
    themeMode,
    getAlphaColor,
    darkenColor,
    lightenColor,
    getBorderRipple,
    getHexValue,
  };
};

export default useTheming;
