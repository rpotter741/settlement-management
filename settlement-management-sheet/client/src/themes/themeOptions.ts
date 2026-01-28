import commonStyles from './commonStyles.js';

const themeOptions = {
  default: {
    palette: {
      mode: 'light', // Default mode: 'light' | 'dark'

      primary: {
        main: '#9E2A2B',
        light: '#C65B59',
        dark: '#7A1D1E',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#3e5c76',
        light: '#4a6e8f',
        dark: '#2e4356',
        contrastText: '#FFFFFF',
      },

      error: {
        main: '#d72638',
        light: '#f48b8b',
        dark: '#a10010',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: '#f28c28',
        light: '#f7b36b',
        dark: '#c56a1a',
        contrastText: '#242424',
      },
      info: {
        main: '#3b82f6', // Nice blue
        light: '#93c5fd',
        dark: '#1e3a8a',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#4e9f3d',
        light: '#a0e99f',
        dark: '#357a29',
        contrastText: '#FFFFFF',
      },

      background: {
        default: '#f5f0e6', // General background color
        paper: '#fbf7ef', // Used for cards, modals, etc.
      },
      text: {
        primary: '#242424', // Main text color
        secondary: '#5a5a5a', // Subdued text color
        disabled: '#9e9e9e', // For disabled elements
      },

      divider: '#c3c3c3', // Line dividers
      dividerDark: '#9e9e9e',

      // Custom keys
      honey: {
        main: '#d49f38',
        light: '#f3d9a6',
        dark: '#a67827',
      },
      accent: {
        main: '#e09f3e',
        light: '#f2c57c',
      },

      action: {
        active: '#C65B59', // Color for active elements
        hover: '#b74445',
        hoverOpacity: 0.08,
        selected: '#881c1d',
        selectedOpacity: 0.12,
        disabled: '#9e9e9e',
        disabledBackground: '#e0e0e0',
        disabledOpacity: 0.38,
        focus: '#f2c57c', // Focus color
      },

      // Shadows (Custom addition)
      shadow: {
        main: 'rgba(36,36,36,0.2)',
        light: 'rgba(36,36,36,0.1)',
        dark: 'rgba(36,36,36,0.3)',
      },
    },
    components: commonStyles,
  },
  dark: {
    palette: {
      mode: 'dark',

      primary: {
        main: '#C65B59',
        light: '#f28e8c',
        dark: '#7A1D1E',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#4a6e8f',
        light: '#6e90a9',
        dark: '#2e4356',
        contrastText: '#ffffff',
      },

      error: {
        main: '#d72638',
        light: '#f48b8b',
        dark: '#a10010',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#ff9f1c',
        light: '#ffc266',
        dark: '#cc7a00',
        contrastText: '#000000',
      },
      info: {
        main: '#3b82f6',
        light: '#93c5fd',
        dark: '#1e3a8a',
        contrastText: '#ffffff',
      },
      success: {
        main: '#4e9f3d',
        light: '#a0e99f',
        dark: '#357a29',
        contrastText: '#ffffff',
      },

      background: {
        paper: 'rgb(22,22,22)', // Matte base
        default: 'rgb(36,36,36)', // Slight elevation
      },
      text: {
        primary: '#EAEAEA',
        secondary: '#A0A0A0',
        disabled: '#666666',
      },

      divider: 'rgba(255,255,255,0.12)',
      dividerDark: 'rgba(255,255,255,0.24)',

      // Matching your unique keys
      honey: {
        main: '#d49f38',
        light: '#f3d9a6',
        dark: '#a67827',
      },
      accent: {
        main: '#e09f3e',
        light: '#f2c57c',
      },

      action: {
        active: '#f2c57c',
        hover: 'rgba(255,255,255,0.08)',
        hoverOpacity: 0.08,
        selected: 'rgba(255,255,255,0.16)',
        selectedOpacity: 0.16,
        disabled: '#666666',
        disabledBackground: '#2e2e2e',
        disabledOpacity: 0.38,
        focus: '#f2c57c',
      },

      shadow: {
        main: 'rgba(222,0,0,0.6)',
        light: 'rgba(222,0,0,0.3)',
        dark: 'rgba(222,0,0,0.75)',
      },
    },
    components: commonStyles,
  },
};

export default themeOptions;
