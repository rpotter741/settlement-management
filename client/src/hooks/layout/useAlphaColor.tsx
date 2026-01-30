import { useTheme, alpha } from '@mui/material/styles';

const useAlphaColor = () => {
  const theme = useTheme();

  const getAlphaColor = (
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info',
    key: 'main' | 'dark' | 'light',
    opacity: number
  ) => alpha(theme.palette[color][key], opacity);

  return { getAlphaColor };
};

export default useAlphaColor;
