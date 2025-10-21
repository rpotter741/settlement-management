import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { GenericObject } from '../../../../../../../../shared/types/common.js';

const SubTypeTextTransformSelect = ({
  onChange,
  property,
  mode,
}: {
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  property: GenericObject;
  mode: 'focus' | 'form' | 'preview';
}) => {
  if (mode !== 'focus') {
    return (
      <FormControl sx={{ flex: 1, minWidth: 120, width: '100%' }}>
        <InputLabel id="property-text-transform-label">
          Property Text Transform
        </InputLabel>
        <Select
          labelId="property-text-transform-label"
          label="Property Text Transform"
          value={property.textTransform || 'none'}
          sx={{ textAlign: 'start', flex: 2, width: '100%' }}
          onChange={(e) => onChange(e as React.ChangeEvent<{ value: unknown }>)}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="uppercase">UPPERCASE</MenuItem>
          <MenuItem value="lowercase">lowercase</MenuItem>
          <MenuItem value="capitalize">Capitalize Each Word</MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (mode === 'focus') {
    return (
      <Select
        value={property.textTransform || 'none'}
        sx={{ textAlign: 'start', flex: 2, width: '100%' }}
        onChange={(e) => onChange(e as React.ChangeEvent<{ value: unknown }>)}
      >
        <MenuItem value="none">None</MenuItem>
        <MenuItem value="uppercase">UPPERCASE</MenuItem>
        <MenuItem value="lowercase">lowercase</MenuItem>
        <MenuItem value="capitalize">Capitalize Each Word</MenuItem>
      </Select>
    );
  }
};

export default SubTypeTextTransformSelect;
