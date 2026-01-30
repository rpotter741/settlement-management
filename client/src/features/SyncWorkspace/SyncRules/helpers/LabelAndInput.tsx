import { Box, TextField, Typography } from '@mui/material';

const LabelAndInput = ({
  name,
  type,
  value,
  onChange,
  disabled,
  size = 'small',
  placeholder = 'Infinity',
}: {
  name: string;
  type: 'text' | 'number';
  value: number;
  onChange: (newValue: string | number) => void;
  disabled: boolean;
  size?: 'small' | 'medium';
  placeholder?: string;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        width: '100%',
        px: 4,
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      <Typography sx={{ width: '33%' }}>{name}</Typography>
      <TextField
        fullWidth
        type={type}
        size={size}
        value={value !== null ? (value === 0 ? 'Infinity' : value) : null}
        onChange={(e) => {
          const val =
            type === 'number' ? parseInt(e.target.value) : e.target.value;
          if (typeof val === 'number' && type === 'number' ? val >= 0 : true) {
            onChange(val);
          } else {
            onChange(0);
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
      />
    </Box>
  );
};

export default LabelAndInput;
