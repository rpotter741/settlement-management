import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';

import commonStyles from '../themes/commonStyles.js';

import themeOptions from '../themes/themeOptions.js';

// ThemeContext
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState('default'); // Default theme key

  const changeThemeTo = (newThemeKey) => {
    if (themeOptions[newThemeKey]) {
      setThemeKey(newThemeKey); // Change to the provided theme key
    } else {
      console.warn(`Theme "${newThemeKey}" is not defined in themeOptions.`);
      setThemeKey('default');
    }
  };

  // Dynamically generate the theme based on the themeKey state
  const muiTheme = useMemo(() => {
    const selectedTheme = themeOptions[themeKey] || themeOptions.default;
    return createTheme({
      ...selectedTheme,
      components: { ...commonStyles },
    });
  }, [themeKey]);

  useEffect(() => {
    const backgroundColor =
      muiTheme.palette.mode === 'dark'
        ? muiTheme.palette.background.paper
        : muiTheme.palette.background.default;

    document.documentElement.style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = muiTheme.palette.text.primary;
  }, [muiTheme]);

  return (
    <ThemeContext.Provider value={{ themeKey, changeThemeTo }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom Hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);
