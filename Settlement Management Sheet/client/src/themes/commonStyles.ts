const commonStyles = {
  MuiBox: {
    styleOverrides: {
      root: {
        variants: [
          {
            props: { variant: 'checkListItem' },
            style: {
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'start',
              gridColumn: 'span 3',
              backgroundColor: 'success.main',
            },
          },
        ],
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
    },
  },
};

export default commonStyles;
