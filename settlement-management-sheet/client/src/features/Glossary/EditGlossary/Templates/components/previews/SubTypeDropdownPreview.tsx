import {
  Autocomplete,
  Box,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubTypeDropdownData } from '../types.js';
import { Close, ConstructionOutlined, Hail } from '@mui/icons-material';
import getPreviewSx from './previewSxMap.js';
import { useSelector } from 'react-redux';
import {
  selectActiveId,
  selectGlossaryStructure,
} from '@/app/selectors/glossarySelectors.js';
import { useShellContext } from '@/context/ShellContext.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import { RELATIONSHIP_RANK } from '@/utility/hasParentProperty.js';
import capitalize from '@/utility/inputs/capitalize.js';
import { normalize } from 'path';

const SubTypeDropdownPreview = ({
  property,
  onChange,
  isPreview,
  source,
  isCompound = false,
  allSelectedValues,
  side,
  keypath,
  liveEdit,
  glossaryId,
  isAnchor,
  columns,
}: {
  property: any;
  onChange: (value: unknown, keypath: string, nukedIds?: string[]) => void;
  isPreview: boolean;
  source: SubTypeDropdownData;
  isCompound?: boolean;
  allSelectedValues?: unknown[];
  side?: 'left' | 'right';
  keypath: string;
  liveEdit: boolean;
  glossaryId: string | null;
  isAnchor?: boolean;
  columns?: 1 | 2 | 4;
}) => {
  const { entry, inheritanceMap } = liveEdit
    ? useShellContext()
    : { entry: null, inheritanceMap: null };

  const { showModal } = useModalActions();
  const [value, setValue] = useState<unknown>(
    source?.value
      ? source.value
      : property?.shape?.defaultValue
        ? property.shape.defaultValue
        : property.shape.selectType === 'multi'
          ? []
          : ''
  );

  const highlighted = useRef<null | {
    value: string;
    name: string;
    relationship: string;
  }>(null);

  const { relationship } = property.shape || {};
  const allNodes = useSelector(selectGlossaryStructure(glossaryId ?? ''));
  const nodeOptions: { value: string; name: string }[] = useMemo(() => {
    if (relationship && liveEdit && allNodes) {
      return allNodes
        .filter(
          (node) =>
            relationship.includes(node.entryType) && node.id !== entry?.id
        )
        .map((node) => ({
          relationship: inheritanceMap?.relationships[node.id] || 'other',
          value: node.id,
          name: node.name,
        }));
    }
    return [];
  }, [relationship, liveEdit, allNodes, glossaryId, entry]);

  useEffect(() => {
    if (source?.value !== undefined && source?.value !== value) {
      setValue(source.value);
    }
  }, [source?.value]);

  const handleChange = useCallback(
    (value: unknown, newEntryName?: string) => {
      let valueToUse = value;

      if (value === 'addNewOption' && liveEdit) {
        const modalEntry = {
          id: 'addNewEntryOption',
          componentKey: 'CreateGlossaryEntryFromDropdown',
          props: {
            keypath,
            property,
            glossaryId: glossaryId!,
            newEntryName,
            sourceId: entry.id,
          },
        };
        showModal({ entry: modalEntry });
        return;
      }
      if (property.shape.selectType === 'multi' && !Array.isArray(value)) {
        valueToUse = [value];
      }
      if (property.shape.selectType === 'single' && Array.isArray(value)) {
        valueToUse = value[0] || '';
      }
      if (property.shape.selectType === 'multi' && Array.isArray(value)) {
        valueToUse = [...value];
        if (
          property.shape.maxSelections &&
          value?.length > property.shape.maxSelections
        ) {
          valueToUse = [...value].slice(0, property.shape.maxSelections);
        }
      }
      if (property.shape.selectType === 'single' || !relationship) {
        setValue(valueToUse);
      }
      const nukedIds: string[] = [];

      // check to see if it's a new value. If it is, we need to remove the entries at the ids of the changed values (the added / removed values).
      if (valueToUse !== source.value && relationship) {
        if (property.shape.selectType === 'multi') {
          const oldValues = Array.isArray(source.value) ? source.value : [];
          const newValues = Array.isArray(valueToUse) ? valueToUse : [];
          // find removed values
          oldValues.forEach((oldVal) => {
            if (!newValues.includes(oldVal)) {
              nukedIds.push(oldVal as string);
            }
          });
          // find added values
          newValues.forEach((newVal) => {
            if (!oldValues.includes(newVal)) {
              nukedIds.push(newVal as string);
            }
          });
        } else {
          nukedIds.push(source.value as string);
          nukedIds.push(valueToUse as string);
        }
      }
      onChange(valueToUse, `${keypath}.value`, nukedIds.filter(Boolean));
    },
    [
      isPreview,
      onChange,
      property.shape.selectType,
      property.shape.maxSelections,
    ]
  );

  const options = useMemo(() => {
    if (property.shape.optionType === 'list') {
      const options = (property?.shape.options || [])
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
      return property?.shape.selectType === 'multi'
        ? options.filter(
            (option: any) => !source?.value?.includes(option.value)
          )
        : options;
    }

    // insert logic for entry type fetching (eg, use the nodes, baby! the nodes!!!!)
    const preservedSet = new Set(
      Array.isArray(source?.value) ? source?.value : [source?.value]
    );
    const options = nodeOptions
      .slice()
      .filter((option) => {
        // always remove values already selected in this component so they remain visible/editable
        if (
          preservedSet.has(option.value) &&
          property.shape.selectType === 'multi'
        )
          return false;

        // when rendering the editable list (column === 4) avoid duplicates and the source entry itself
        if (columns === 4) {
          if (option.value === entry?.id) return false;
          if (allSelectedValues?.includes(option.value)) return false;
          return true;
        }

        // default: include the option
        return true;
      })
      .map((option) => ({
        ...option,
        // Attach the relationship from your inheritance map
        relationship: inheritanceMap?.relationships[option.value] || 'other',
      }))
      .sort((a, b) => {
        const rankA = RELATIONSHIP_RANK[a.relationship] || 99;
        const rankB = RELATIONSHIP_RANK[b.relationship] || 99;
        if (rankA !== rankB) {
          return rankA - rankB;
        }
        return a.name.localeCompare(b.name); // secondary sort by name
      });

    if (isCompound && allSelectedValues && side === 'left') {
      // preserve any values currently selected in this component (single or multi)
      const selectedSet = new Set(
        Array.isArray(source?.value) ? source?.value : [source?.value]
      );
      console.log(selectedSet);
      return options.filter(
        (option: any) =>
          selectedSet.has(option.value) ||
          !allSelectedValues.includes(option.value)
      );
    }

    return options;
  }, [
    property?.shape.options,
    property.shape.optionType,
    allSelectedValues,
    isCompound,
    nodeOptions,
    source?.value,
  ]);

  const normalizeSelectValue = (val: any, selectType: 'single' | 'multi') =>
    selectType === 'multi'
      ? Array.isArray(val)
        ? val
        : []
      : Array.isArray(val)
        ? val[0]
        : val;

  const sx = getPreviewSx('dropdown', columns ?? 4, isCompound ?? false);

  // helpers to map between the primitive stored value(s) and the option objects used by Autocomplete
  const findOptionByValue = (val: string | undefined) => {
    const opt = options.find((o: any) => o.value === val) || null;
    if (opt) {
      return opt;
    }
    if (property.shape.optionType === 'list') {
      return { value: '', name: '', relationship: 'other' };
    }
    if (property.shape.optionType === 'entryType') {
      return { value: '', name: '', relationship: 'other' };
    }
  };

  const getAutocompleteValue = () => {
    if (property.shape.selectType === 'multi') {
      const vals = normalizeSelectValue(value, 'multi') as string[];

      if (property.shape.optionType !== 'list') {
        const valOptions = vals //uh what?!?!?!?!
          .filter((o: any) => vals.includes(o.value))
          .map((o: any) => ({ value: o.value, name: o.name }));
        return valOptions;
      } else {
        const multiList = vals.map((val) => ({ value: val, name: val }));

        return multiList;
      }
    } else if (property.shape.selectType === 'single') {
      return findOptionByValue(value as string);
    }
    return '';
  };

  const valueList = useMemo(() => {
    if (property.shape.selectType === 'multi' && property.shape.relationship) {
      const vals = normalizeSelectValue(source?.value, 'multi') as string[];
      return nodeOptions.filter((o) => vals.includes(o.value));
    } else if (
      property.shape.selectType === 'multi' &&
      property.shape.optionType === 'list'
    ) {
      const vals = normalizeSelectValue(source?.value, 'multi') as string[];

      return vals.map((val: string) => {
        return { value: val, name: capitalize(val) };
      });
    }
    return [];
  }, [source?.value, property.shape.selectType, nodeOptions]);

  const isMulti = property.shape.selectType === 'multi';

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {sx.useSideLabel ? (
          <Typography
            sx={{
              width: '60%',
              textAlign: 'start',
              fontSize: '1.25rem',
              color: isAnchor ? 'info.main' : 'inherit',
            }}
          >
            {property.displayName || property.name}
          </Typography>
        ) : null}
        <FormControl
          sx={{
            minWidth: 120,
            textAlign: 'start',
            width: '100%',
            display: 'flex',
            justifyContent: 'start',
          }}
        >
          <Autocomplete
            sx={{
              '& .MuiAutocomplete-inputLabel': {
                color: isAnchor ? 'info.main' : 'inherit',
              },
            }}
            multiple={isMulti}
            options={options}
            value={getAutocompleteValue()}
            onHighlightChange={(event, option, reason) => {
              highlighted.current = option;
            }}
            renderTags={() => null} // disable default tag rendering
            onChange={(event, newValue) => {
              if (!newValue) return;
              if (isMulti) {
                const newVals = (
                  newValue as {
                    value: string;
                    name: string;
                    relationship?: string;
                  }[]
                )
                  .filter(Boolean)
                  .map((o) => o.value);
                handleChange([...source.value, ...newVals]);
              } else {
                const val =
                  (
                    newValue as {
                      value: string;
                      name: string;
                      relationship?: string;
                    } | null
                  )?.value || '';
                handleChange(val);
              }
              highlighted.current = null;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  !isCompound && !sx.useSideLabel
                    ? property.displayName || property.name || 'Select'
                    : undefined
                }
                sx={{
                  '& label': {
                    color: isAnchor ? 'info.main' : 'inherit',
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (!highlighted.current) {
                      handleChange(
                        'addNewOption',
                        params.inputProps.value as string
                      );
                    }
                  }
                }}
                onBlur={() => {
                  highlighted.current = null;
                }}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem
                {...props}
                key={option.value}
                value={option.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.shiftKey) {
                    //handle opening a new tab instead of adding option to list
                  } else {
                    if (isMulti) {
                      const newVals = Array.isArray(source.value)
                        ? [...source.value, option.value]
                        : [option.value];
                      handleChange(newVals);
                    } else {
                      handleChange(option.value);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.key === 'Enter') {
                    if (e.shiftKey) {
                      //handle opening a new tab instead of adding option to list
                    } else {
                      if (isMulti) {
                        const newVals = Array.isArray(source.value)
                          ? [...source.value, option.value]
                          : [option.value];
                        handleChange(newVals);
                      } else {
                        handleChange(option.value);
                      }
                    }
                  }
                }}
              >
                {option.name}
              </MenuItem>
            )}
            getOptionLabel={(option) => option.name}
            groupBy={(option) =>
              option.relationship
                ? capitalize(option.relationship)
                : property.name
            }
          />
        </FormControl>
      </Box>
      {property.shape.selectType === 'multi' && columns === 4 && (
        <Box sx={{ mt: 1, width: '100%' }}>
          {valueList.map(
            (val: { value: string; name: string }, index: number) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}
              >
                <IconButton
                  onClick={() => {
                    const newValues = (source.value as string[]).filter(
                      (v) => v !== val.value
                    );
                    handleChange(newValues);
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
                <Typography>{val?.name}</Typography>
              </Box>
            )
          )}
        </Box>
      )}
    </>
  );
};

export default SubTypeDropdownPreview;
