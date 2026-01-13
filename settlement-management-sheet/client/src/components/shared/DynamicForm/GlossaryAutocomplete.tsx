import React, { useMemo, useEffect } from 'react';
import {
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
  Tooltip,
} from '@mui/material';
import { capitalize } from 'lodash';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/glossary/useNodeEditor.js';
import { alphabetize } from '@/utility/alphabetizeStringArray.js';
import { alpha, Box } from '@mui/system';
import { useSelector } from 'react-redux';
import {
  selectGlossaryNodes,
  selectGlossaryStructure,
  selectKeypathOptions,
} from '@/app/selectors/glossarySelectors.js';
import { GlossaryEntry, GlossaryNode, SubModelType } from 'types/index.js';
import thunks from '@/app/thunks/glossaryThunks.js';
import actions from '@/services/glossaryServices.js';

interface GlossaryAutocompleteProps {
  subModel: SubModelType;
  multiple?: boolean;
  label: string;
  keypath: keyof GlossaryEntry;
  alphabetizeOptions?: boolean;
  hasPrimary?: boolean;
  placeholder?: string;
}

const GlossaryAutocomplete: React.FC<GlossaryAutocompleteProps> = ({
  multiple = true,
  subModel,
  label,
  keypath,
  alphabetizeOptions = true,
  hasPrimary = false,
  placeholder,
}) => {
  //
  const { glossaryId, id, inheritanceMap, tabId } = useShellContext();
  if (!glossaryId) return null;
  const {
    entry,
    node,
    updateSubModel,
    getOptionsByKeypath,
    buildOptionsByKeypath,
  } = useNodeEditor(glossaryId, id);

  const options = getOptionsByKeypath(keypath);

  const buildGroupedSelectOptions = (
    rawOptions: Record<
      string,
      Array<{ id: string; name: string; [key: string]: any }>
    >,
    property: string
  ) => {
    return Object.entries(rawOptions)
      .map(([groupLabel, entries]) => {
        const cleanOptions = entries
          .filter((e) => !!e[property])
          .map((e) => ({
            label: e[property],
            value: e[property],
            meta: {
              id: e.id,
              name: e.name,
              relationship: groupLabel,
            },
          }));

        return cleanOptions.length
          ? { label: capitalize(groupLabel), options: cleanOptions }
          : null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (!options) {
      buildOptionsByKeypath(keypath, inheritanceMap);
    }
  }, [keypath, options]);

  const [primary, setPrimary] = React.useState<string>(
    hasPrimary ? 'Aymaq' : ''
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  type Relationships = 'inherited' | 'nearby' | 'extended' | 'other';

  const RELATIONSHIP_PRIORITY = [
    'inherited',
    'nearby',
    'extended',
    'other',
  ] as const;

  type RelationshipType = (typeof RELATIONSHIP_PRIORITY)[number];

  interface SmartGlossaryOption {
    value: string;
    label: string;
    group: string;
    sources: {
      id: string;
      name: string;
      relationship: RelationshipType;
    }[];
  }

  function dedupeGroupedGlossaryOptions(
    raw: Record<
      RelationshipType,
      { id: string; name: string; [key: string]: any }[]
    >,
    property: string
  ): SmartGlossaryOption[] {
    const map = new Map<string, SmartGlossaryOption>();
    const relationships = {
      inherited: 1,
      nearby: 2,
      extended: 3,
      other: 4,
    };
    for (const rel of Object.keys(relationships) as RelationshipType[]) {
      for (const entry of raw[rel] ?? []) {
        const values = Array.isArray(entry[property])
          ? entry[property]
          : entry[property];
        if (!values) continue;
        for (const value of values) {
          if (map.has(value)) {
            const existing = map.get(value)!;
            existing.sources.push({
              id: entry.id,
              name: entry.name,
              relationship: rel as RelationshipType,
            });
            const tier = relationships[rel as RelationshipType];
            const existingTier =
              relationships[existing.group as RelationshipType];

            if (
              relationships[rel as RelationshipType] <
              relationships[existing.group as RelationshipType]
            ) {
              console.log(
                'Updating group for',
                value,
                'from',
                existing.group,
                'to',
                rel
              );
              existing.group = rel as RelationshipType;
            }
          } else {
            map.set(value, {
              value,
              label: value,
              group: rel,
              sources: [{ id: entry.id, name: entry.name, relationship: rel }],
            });
          }
        }
      }
    }

    return [...map.values()].map((option) => ({
      ...option,
      label: capitalize(option.label),
      group: capitalize(option.group),
    }));
  }

  const displayOptions = useMemo(() => {
    if (!options) return [];

    return Object.entries(options).flatMap(([groupLabel, entries]) =>
      (entries as any).map((e: any) => {
        return {
          label: capitalize(e[keypath as string]),
          value: e[keypath as string],
          group: capitalize(groupLabel), // <-- keep the label for grouping
          meta: { id: e.id[0], name: e.name },
        };
      })
    );
  }, [options, keypath]);

  const handleChange = (newValue: string | string[]) => {
    if (Array.isArray(newValue)) {
      if (hasPrimary) {
        if (!newValue.includes(primary)) {
          newValue = [primary, ...newValue];
        }
      }
      newValue = newValue.map((v: string) => v.trim().toLowerCase());
    }
    updateSubModel({
      subModel,
      keypath,
      data: newValue,
      tabId,
    });
    multiple && inputRef.current?.focus();
  };

  const deduped = options
    ? dedupeGroupedGlossaryOptions(
        options as Record<
          RelationshipType,
          { id: string; name: string; [key: string]: any }[]
        >,
        keypath
      )
    : [];

  const testValue = useMemo(() => {
    return entry?.[subModel]?.[keypath]?.map((v: string) => ({
      label: capitalize(v),
    }));
  }, [entry, subModel, keypath]);

  if (!entry[subModel]) return <div>Loading...</div>;

  return (
    <Autocomplete
      freeSolo
      disablePortal
      multiple={multiple}
      options={deduped}
      groupBy={(option) => option.group}
      value={testValue ?? []}
      disableCloseOnSelect={multiple}
      onChange={(_event, value) => {
        if (value === null) {
          handleChange(multiple ? [] : '');
        } else if (Array.isArray(value)) {
          handleChange(value.map((v) => v.label) as string[]);
        } else {
          handleChange([value.label] as string[]);
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
            key={option.value}
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
      getOptionLabel={(option: any) => {
        return option[0]?.label || '';
      }}
      renderOption={(props, option, { selected }) => {
        const isPrimary = option.value === primary;
        const isSelectable = selected;
        const canTogglePrimary = isSelectable && !isPrimary;

        return (
          <Box
            component="li"
            {...props} // <- keep MUI’s ARIA & refs intact
            key={option.value}
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
              {capitalize(option.label)}
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default GlossaryAutocomplete;
