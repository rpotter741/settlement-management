import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

const FieldRow = ({
  label,
  children,
  mode,
  flex = 1,
  alignItems = 'center',
  sx = {},
}: {
  label: string;
  children: ReactNode;
  mode: 'focus' | 'form' | 'preview';
  flex?: number;
  alignItems?: string;
  sx?: any;
}) => (
  <Box
    display="flex"
    alignItems={alignItems}
    gap={2}
    py={0.5}
    sx={{ width: '100%', flex, mb: 2, ...sx }}
  >
    {mode === 'focus' && (
      <Typography
        variant="body2"
        sx={{
          width: 125,
          color: 'primary.main',
          textAlign: 'start',
          pt: alignItems === 'start' ? 0.5 : 0,
        }}
      >
        {label}
      </Typography>
    )}
    <Box flex={1} sx={{ ...sx }}>
      {children}
    </Box>
  </Box>
);

export default FieldRow;
