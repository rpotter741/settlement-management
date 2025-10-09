import React, { useMemo } from 'react';
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { capitalize } from 'lodash';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/glossary/useNodeEditor.js';
import { alphabetize } from '@/utility/alphabetizeStringArray.js';
import { alpha, Box } from '@mui/system';
import { Close, Delete } from '@mui/icons-material';
import { GlossaryEntry } from 'types/index.js';
import { SubModelTypes } from '@/features/Glossary/utils/getPropertyLabel.js';

interface GlossaryPropEditorProps {
  multiple?: boolean;
  subModel: SubModelTypes;
  label: string;
  keypath: keyof GlossaryEntry;
  options: string[];
  alphabetizeOptions?: boolean;
  hasPrimary?: boolean;
  placeholder?: string;
}

const GlossaryPropEditor: React.FC<GlossaryPropEditorProps> = ({
  multiple = true,
  subModel,
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
  const [inputValue, setInputValue] = React.useState<any>('');
  const { entry, node, updateSubModel } = useNodeEditor(glossaryId, id);
  const [primary, setPrimary] = React.useState<string>(
    hasPrimary ? 'Aymaq' : ''
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const displayOptions = useMemo(() => {
    let freshOptions = options.filter((option: string) => {
      // Exclude options that are already selected (case-insensitive)
      if (!entry[keypath]) return true;
      if (Array.isArray(entry[keypath])) {
        return !entry[keypath].some(
          (v: string) => v.toLowerCase() === option.toLowerCase()
        );
      }
      return (entry[keypath] as string).toLowerCase() !== option.toLowerCase();
    });
    if (!alphabetizeOptions) {
      return freshOptions.map((option: string) => capitalize(option));
    }
    return alphabetize(freshOptions).map((option: string) => option);
  }, [options]);

  const displayList = useMemo(() => {
    if (!entry[keypath]) return [];
    const items = Array.isArray(entry[keypath])
      ? (entry[keypath] as string[])
      : [entry[keypath] as string];
    return [
      primary,
      ...items.filter((item: string) => item.toLowerCase() !== primary),
    ];
  }, [entry, keypath, primary]);

  const handleChange = (newValue: string | string[]) => {
    if (multiple) {
      const content = [
        ...(Array.isArray(entry[subModel][keypath])
          ? entry[subModel][keypath]
          : entry[subModel][keypath]
            ? [entry[subModel][keypath]]
            : []),
        newValue,
      ].flat();
      updateSubModel({
        subModel: subModel,
        keypath,
        data: content,
      });
      multiple && inputRef.current?.focus();
      return;
    } else {
      const content = newValue;
      updateSubModel({
        subModel: subModel,
        keypath,
        data: content,
      });
    }
  };

  const handleRemove = (option: string) => {
    let values: string[] = [];
    if (Array.isArray(entry[subModel][keypath])) {
      values = entry[subModel][keypath] as string[];
    } else if (typeof entry[subModel][keypath] === 'string') {
      values = [entry[subModel][keypath] as string];
    }
    const updatedOptions = values.filter(
      (item: string) => item.toLowerCase() !== option.toLowerCase()
    );
    updateSubModel({
      subModel,
      keypath,
      data: updatedOptions,
    });
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', my: 2 }}
    >
      <Autocomplete
        options={displayOptions} // already filtered outside
        freeSolo // optional
        disableCloseOnSelect
        value={null} // no option is “selected” here
        inputValue={inputValue} // control the actual text
        blurOnSelect={false} // keep focus after pick
        clearOnBlur // clear when user clicks away
        onInputChange={(_e, newInput) => setInputValue(newInput)}
        onChange={(_e, option) => {
          if (option) handleChange(option); // push to your “selected” list
          setInputValue(''); // wipe textbox
          // Safari sometimes needs a tick before focus comes back
          setTimeout(() => inputRef.current?.focus());
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={inputRef}
            placeholder={`Search for ${label}…`}
            variant="outlined"
            fullWidth
          />
        )}
        clearOnEscape
        selectOnFocus
        handleHomeEndKeys
        getOptionLabel={(o) => capitalize(o)}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option} sx={{ px: 1 }}>
            {capitalize(option)}
          </Box>
        )}
      />
      <Box>
        {multiple ? (
          displayList.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                mt: 1,
              }}
            >
              {displayList.map((option: string, index: number) => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    width: '100%',
                    position: 'relative',
                  }}
                  key={option}
                >
                  <IconButton
                    onClick={() => handleRemove(option)}
                    disabled={primary === option.toLowerCase()}
                  >
                    <Delete
                      sx={{
                        color:
                          primary === option.toLowerCase()
                            ? 'transparent'
                            : 'inherit',
                      }}
                    />
                  </IconButton>
                  {hasPrimary && (
                    <Tooltip
                      title={`Click to set ${option} as primary`}
                      placement="auto"
                    >
                      <Checkbox
                        checked={primary === option.toLowerCase()}
                        onChange={() => {
                          if (primary === option) {
                            return;
                          } else {
                            setPrimary(option.toLowerCase());
                          }
                        }}
                        disabled={primary === option.toLowerCase()}
                        sx={{ mr: 2 }}
                      />
                    </Tooltip>
                  )}
                  <Typography>{capitalize(option)}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: 'left',
                mt: 1,
                ml: 4,
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              No {label} selected
            </Box>
          )
        ) : (
          <Box
            sx={{
              mt: 1,
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            {entry[keypath]
              ? `Selected: ${capitalize(entry[subModel][keypath] as string)}`
              : `No ${{ label }} selected`}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GlossaryPropEditor;
