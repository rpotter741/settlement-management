import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { GenericObject } from '../../../../../../../../shared/types/common.js';

const SubTypeSelectWrapper = ({
  onChange,
  property,
  mode,
  options,
  label,
  keypath,
}: {
  onChange: (e: React.ChangeEvent<{ value: unknown }>, keypath: string) => void;
  property: GenericObject;
  mode: 'focus' | 'form' | 'preview';
  options: Array<{ name: string; value: any }>;
  label: string;
  keypath: string;
}) => {
  const labelId = `property-${label.toLowerCase().replace(/\s+/g, '-')}-label`;
  if (mode !== 'focus') {
    return (
      <FormControl sx={{ flex: 1, minWidth: 120, width: '100%' }}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          label={label}
          value={property[keypath] ?? ''}
          sx={{ textAlign: 'start', flex: 2, width: '100%' }}
          onChange={(e) =>
            onChange(e as React.ChangeEvent<{ value: unknown }>, keypath)
          }
        >
          {options.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (mode === 'focus') {
    return (
      <Select
        value={property[keypath] ?? ''}
        sx={{ textAlign: 'start', flex: 2, width: '100%' }}
        onChange={(e) => {
          onChange(e as React.ChangeEvent<{ value: unknown }>, keypath);
        }}
      >
        {options.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.name}
          </MenuItem>
        ))}
      </Select>
    );
  }
};

export default SubTypeSelectWrapper;
