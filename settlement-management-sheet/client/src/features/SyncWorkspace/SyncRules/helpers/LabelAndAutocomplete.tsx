import { Info } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

const LabelAndAutocomplete = ({
  name,
  options,
  value,
  onChange,
  getTargetTooltip,
}: {
  name: string;
  value: { group: string; label: string } | null;
  options: { group: string; label: string }[];
  onChange: (newValue: string) => void;
  getTargetTooltip?: (label: string) => string;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        width: '100%',
        px: 4,
      }}
    >
      <Typography sx={{ width: '33%' }}>{name}</Typography>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <Autocomplete
          sx={{ cursor: 'pointer' }}
          fullWidth
          options={options.filter((opt) => opt.label !== value?.label)}
          getOptionLabel={(option) => option.label}
          groupBy={(option) => option.group}
          renderInput={(params) => (
            <TextField {...params} sx={{ cursor: 'pointer' }} size="small" />
          )}
          value={value}
          onChange={(event, newValue) => {
            onChange(newValue?.label || 'Child');
          }}
        />
        {getTargetTooltip && (
          <Tooltip
            title={
              <Typography>{getTargetTooltip(value?.label || '')}</Typography>
            }
            arrow
            sx={{ fontSize: '1.5rem' }}
          >
            <Info color="info" sx={{ ml: 1 }} />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default LabelAndAutocomplete;
