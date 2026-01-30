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
import { BreakpointOverrides } from '@mui/system';

import commonStyles from '../themes/commonStyles.js';

import themeOptions from '../themes/themeOptions.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { isEqual } from 'lodash';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; // Add xs breakpoint if needed
    sm: true; // Add sm breakpoint if needed
    md: true; // Add md breakpoint if needed
    lg: true; // Add lg breakpoint if needed
    xl: true; // Add xl breakpoint if needed
    xxl: true; // Add xxl breakpoint if needed
    xxxl: true; // Add 4xl breakpoint if needed
  }
}

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
  const { staticTheme } = useGlossaryEditor();

  // Dynamically generate the theme based on the themeKey state
  const muiTheme = useMemo(() => {
    const selectedTheme = themeOptionsTyped[themeKey] || themeOptions.default;
    const mode = selectedTheme.palette?.mode as 'light' | 'dark';
    let glossaryAdjustments = {};
    if (staticTheme && typeof staticTheme === 'object') {
      console.log('Applying static theme adjustments:', staticTheme[mode]);
      glossaryAdjustments = {
        ...staticTheme[mode],
      };
    }

    return createTheme({
      ...selectedTheme,
      palette: {
        ...selectedTheme.palette,
        ...glossaryAdjustments,
        mode,
      },
      components: {
        ...commonStyles,
        ...(selectedTheme.components || {}),
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
          xxl: 1920, // Add xxl breakpoint if needed
          xxxl: 3840, // Add 4xl breakpoint if needed
        },
      },
    });
  }, [themeKey, staticTheme]);

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
