import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { GenericObject } from '../../../../../../../../shared/types/common.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { get } from 'lodash';

const SubTypeSelectWrapper = ({
  onChange,
  property,
  mode,
  options,
  label,
  keypath,
  multiple = false,
}: {
  onChange: (e: React.ChangeEvent<{ value: unknown }>, keypath: string) => void;
  property: GenericObject;
  mode: SubTypeModes;
  options: Array<{ name: string; value: any }>;
  label: string;
  keypath: string;
  multiple?: boolean;
}) => {
  const labelId = `property-${label.toLowerCase().replace(/\s+/g, '-')}-label`;

  if (mode !== 'property') {
    return (
      <FormControl sx={{ flex: 1, minWidth: 120, width: '100%' }}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          multiple={multiple}
          labelId={labelId}
          label={label}
          value={
            multiple
              ? Array.isArray(get(property, keypath))
                ? get(property, keypath)
                : [get(property, keypath)]
              : (get(property, keypath) ?? '')
          }
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

  if (mode === 'property') {
    return (
      <Box sx={{ flex: 0, maxWidth: '659px' }}>
        <Select
          multiple={multiple}
          value={get(property, keypath) ?? (multiple ? [] : '')}
          sx={{
            textAlign: 'start',
            flex: 2,
            width: '100%',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
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
      </Box>
    );
  }
};

export default SubTypeSelectWrapper;
