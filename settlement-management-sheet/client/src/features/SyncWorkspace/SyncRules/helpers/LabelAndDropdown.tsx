import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

const LabelAndDropdown = ({
  name,
  options,
  value,
  onChange,
  relationship = false,
  multiple = false,
  disabled = false,
  usePropLabel = true,
  size = 'small',
}: {
  name: string;
  options: string[];
  value: string | string[] | null;
  multiple: boolean | undefined;
  relationship: boolean;
  onChange: (newValue: string | string[] | null) => void;
  disabled?: boolean;
  usePropLabel?: boolean;
  size?: 'small' | 'medium';
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
      <ASelect
        disabled={disabled}
        label={''}
        options={options}
        value={value}
        onChange={onChange}
        relationship={relationship}
        multiple={multiple}
        usePropLabel={usePropLabel}
        size={size}
      />
    </Box>
  );
};

const ASelect = ({
  label,
  options,
  value,
  onChange,
  multiple,
  relationship = false,
  disabled,
  usePropLabel = true,
  size = 'small',
}: {
  label: string;
  options: string[];
  value: string | string[] | null;
  multiple?: boolean;
  relationship?: boolean;
  onChange: (newValue: string | string[] | null) => void;
  disabled: boolean;
  usePropLabel?: boolean;
  size?: 'small' | 'medium';
}) => {
  const { getPropertyLabel } = usePropLabel
    ? usePropertyLabel()
    : { getPropertyLabel: (v: string) => ({ label: v }) };
  const displayValue = relationship
    ? multiple
      ? (value as string[]).map((v) => getPropertyLabel(v).label).join(', ')
      : getPropertyLabel(value as string).label
    : multiple
      ? value
      : value;

  return (
    <>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel>{label}</InputLabel>
        <Select
          size={size}
          value={
            multiple ? (Array.isArray(value) ? value : [value]) : value || ''
          }
          multiple={multiple}
          renderValue={() => displayValue || ''}
          readOnly={disabled}
          sx={{ color: disabled ? 'primary.main' : 'text.primary' }}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              onClick={() =>
                onChange(
                  multiple
                    ? [...(value as string[]), option.toLowerCase()]
                    : option.toLowerCase()
                )
              }
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default LabelAndDropdown;
