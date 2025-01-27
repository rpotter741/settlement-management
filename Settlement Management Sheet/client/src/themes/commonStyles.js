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
};

export default commonStyles;
