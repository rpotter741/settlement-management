import {
  Box,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubTypeDropdownData } from '../types.js';
import { Hail } from '@mui/icons-material';

const SubTypeDropdownPreview = ({
  property,
  onChange,
  isPreview,
  source,
  isCompound = false,
  allSelectedValues,
  side,
}: {
  property: any;
  onChange: (value: unknown) => void;
  isPreview: boolean;
  source: SubTypeDropdownData;
  isCompound?: boolean;
  allSelectedValues?: unknown[];
  side?: 'left' | 'right';
}) => {
  const [value, setValue] = useState<unknown>(
    isPreview
      ? property.selectType === 'multi'
        ? []
        : ''
      : source.value || property.value || ''
  );

  const handleChange = useCallback(
    (value: unknown) => {
      if (!isPreview) {
        if (property.selectType === 'multi' && !Array.isArray(value)) {
          value = [value];
        }
        if (property.selectType === 'single' && Array.isArray(value)) {
          value = value[0] || '';
        }
        if (property.selectType === 'multi' && Array.isArray(value)) {
          if (property.maxSelections && value.length > property.maxSelections) {
            value = value.slice(0, property.maxSelections);
          }
        }
        setValue(value);
        onChange(value);
      } else {
        setValue(value);
        onChange(value);
      }
    },
    [isPreview, onChange, property.selectType, property.maxSelections]
  );

  const options = useMemo(() => {
    if (property.optionType === 'list') {
      const options = (property?.options || [])
        .slice()
        .sort((a: string, b: string) => a.localeCompare(b))
        .map((option: any) => ({
          value: option,
          name: option,
        }));

      if (isCompound && allSelectedValues && side === 'left') {
        // preserve any values currently selected in this component (single or multi)
        const selectedSet = new Set(Array.isArray(value) ? value : [value]);
        return options.filter(
          (option: any) =>
            selectedSet.has(option.value) ||
            !allSelectedValues.includes(option.value)
        );
      }
      return options;
    }
    // insert logic for entry type fetching (eg, use the nodes, baby! the nodes!!!!)
    return [];
  }, [property?.options, property.optionType, allSelectedValues, isCompound]);

  const normalizeSelectValue = (val: any, type: 'single' | 'multi') =>
    type === 'multi'
      ? Array.isArray(val)
        ? val
        : []
      : Array.isArray(val)
        ? ''
        : val;
  return (
    <FormControl
      sx={{
        minWidth: 120,
        maxWidth: 400,
        textAlign: 'start',
        width: '100%',
      }}
    >
      <InputLabel id={`sub-type-dropdown-${property.id}`}>
        {property.name || 'Dropdown'}
      </InputLabel>
      <Select
        multiple={property.selectType === 'multi'}
        labelId={`sub-type-dropdown-${property.id}`}
        label={property.name || 'Dropdown'}
        value={normalizeSelectValue(value, property.selectType)}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
        sx={{ height: 56, borderBottom: 'none' }}
      >
        {options?.map(
          (option: { value: string; name: string }, index: number) => (
            <MenuItem key={index} value={option.value}>
              {option.name}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default SubTypeDropdownPreview;
