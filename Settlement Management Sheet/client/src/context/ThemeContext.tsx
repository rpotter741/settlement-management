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

// Add this type assertion or define the type in themeOptions.js for better safety
const themeOptionsTyped: { [key: string]: typeof themeOptions.default } =
  themeOptions;

interface ThemeContextType {
  themeKey: string;
  changeThemeTo: (newThemeKey: string) => void;
}

// ThemeContext
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeKey, setThemeKey] = useState<string>('dark');
  // Function to change the theme key
  const changeThemeTo = (newThemeKey: string) => {
    if (themeOptionsTyped[newThemeKey]) {
      setThemeKey(newThemeKey); // Change to the provided theme key
    } else {
      console.warn(`Theme "${newThemeKey}" is not defined in themeOptions.`);
      setThemeKey('default');
    }
  };

  // Dynamically generate the theme based on the themeKey state
  const muiTheme = useMemo(() => {
    const selectedTheme = themeOptionsTyped[themeKey] || themeOptions.default;
    return createTheme({
      ...selectedTheme,
      //@ts-ignore
      components: {
        ...commonStyles,
        ...(selectedTheme.components || {}),
      },
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
