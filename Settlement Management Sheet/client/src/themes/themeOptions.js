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
        main: '#f2be22',
        light: '#f8d469',
        dark: '#b68d00',
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
        default: '#fbf7ef', // General background color
        paper: '#f5f0e6', // Used for cards, modals, etc.
      },
      text: {
        primary: '#242424', // Main text color
        secondary: '#5a5a5a', // Subdued text color
        disabled: '#9e9e9e', // For disabled elements
      },

      divider: '#c3c3c3', // Line dividers

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
        active: '#7A1D1E', // Color for active elements
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
  },
};

export default themeOptions;
