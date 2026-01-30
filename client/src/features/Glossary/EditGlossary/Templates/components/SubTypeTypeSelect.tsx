import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { subTypePropertyTypes } from '../generics/genericContinent.js';
import { propertyTypeLabelMap } from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarProperty.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';

const SubTypeTypeSelect = ({
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
        <InputLabel id="property-type-label">Property Type</InputLabel>
        <Select
          labelId="property-type-label"
          label="Property Type"
          value={property.type}
          sx={{ textAlign: 'start', flex: 2, width: '100%' }}
          onChange={(e) => onChange(e as React.ChangeEvent<{ value: unknown }>)}
        >
          {subTypePropertyTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {propertyTypeLabelMap[type] || 'Unknown'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (mode === 'focus') {
    return (
      <Select
        value={property.type}
        sx={{ textAlign: 'start', flex: 2, width: '100%' }}
        onChange={(e) => onChange(e as React.ChangeEvent<{ value: unknown }>)}
      >
        {subTypePropertyTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {propertyTypeLabelMap[type] || 'Unknown'}
          </MenuItem>
        ))}
      </Select>
    );
  }
};

export default SubTypeTypeSelect;
