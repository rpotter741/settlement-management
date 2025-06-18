import React, { useMemo } from 'react';
import {
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
  Tooltip,
} from '@mui/material';
import { capitalize } from 'lodash';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/useNodeEditor.js';
import { alphabetize } from '@/utility/alphabetizeStringArray.js';
import { alpha, Box } from '@mui/system';

interface GlossaryAutocompleteProps {
  multiple?: boolean;
  label: string;
  keypath: string;
  options: string[];
  alphabetizeOptions?: boolean;
  hasPrimary?: boolean;
  placeholder?: string;
}

const GlossaryAutocomplete: React.FC<GlossaryAutocompleteProps> = ({
  multiple = true,
  label,
  keypath,
  options,
  alphabetizeOptions = true,
  hasPrimary = false,
  placeholder,
}) => {
  //
  const { glossaryId, id } = useShellContext();
  if (!glossaryId) return null;
  const { entry, node, updateGlossaryEntry } = useNodeEditor(glossaryId, id);
  const [primary, setPrimary] = React.useState<string>(
    hasPrimary ? 'Aymaq' : ''
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const displayOptions = useMemo(() => {
    if (!alphabetizeOptions) {
      return options.map((option: string) => capitalize(option));
    }
    return alphabetize(options).map((option: string) => option);
  }, [options]);

  const handleChange = (newValue: string | string[]) => {
    if (Array.isArray(newValue)) {
      if (hasPrimary) {
        if (!newValue.includes(primary)) {
          newValue = [primary, ...newValue];
        }
      }
      newValue = newValue.map((v: string) => v.trim().toLowerCase());
    }
    const content = {
      [keypath]: newValue,
    };
    updateGlossaryEntry(content);
    multiple && inputRef.current?.focus();
  };

  return (
    <Autocomplete
      freeSolo
      limitTags={2}
      disablePortal
      multiple={multiple}
      options={displayOptions}
      value={
        Array.isArray(entry[keypath])
          ? entry[keypath].map((v: string) => capitalize(v))
          : entry[keypath]
            ? [capitalize(entry[keypath])]
            : []
      }
      disableCloseOnSelect={multiple}
      onChange={(_event, value) => {
        if (value === null) {
          handleChange(multiple ? [] : '');
        } else if (Array.isArray(value)) {
          handleChange(value as string[]);
        } else {
          handleChange(value as string);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          label={label}
          variant="outlined"
          fullWidth
          // placeholder={placeholder || `Select or type ${keypath}`}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option}
            {...getTagProps({ index })}
            key={option}
            sx={{
              mr: 0.5,
              mb: 0.5,
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === 'dark' ? 0.5 : 0.9
                ),
              color: 'primary.contrastText',
            }}
          />
        ))
      }
      blurOnSelect={!multiple}
      getOptionLabel={(option) => capitalize(option)}
      renderOption={(props, option, { selected }) => {
        const isPrimary = option === primary;
        const isSelectable = selected;
        const canTogglePrimary = isSelectable && !isPrimary;

        return (
          <Box
            component="li"
            {...props} // <- keep MUI’s ARIA & refs intact
            key={option}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              position: 'relative',
            }}
          >
            <Box>
              {multiple && hasPrimary && (
                <Tooltip
                  title={
                    isPrimary
                      ? `This is the current primary ${keypath}.`
                      : canTogglePrimary
                        ? `Make ${option} the primary ${keypath}`
                        : ''
                  }
                >
                  {/* span keeps Tooltip happy when the checkbox is disabled */}
                  <span>
                    <Checkbox
                      checked={isPrimary}
                      disabled={!canTogglePrimary && !isPrimary}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => setPrimary(option)}
                      disableRipple
                      tabIndex={-1} // don’t steal keyboard focus
                      sx={{ mr: 1 }}
                    />
                  </span>
                </Tooltip>
              )}
              {capitalize(option)}
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default GlossaryAutocomplete;
