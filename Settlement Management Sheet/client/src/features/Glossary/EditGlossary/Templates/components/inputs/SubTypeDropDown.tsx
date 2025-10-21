import {
  Autocomplete,
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  GlossaryEntryType,
  glossaryEntryTypeOptions,
} from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import SubTypeSelectWrapper from '../toggles/SubTypeSelectWrapper.js';
import FieldRow from '../../wrappers/FieldRow.js';
import capitalize from '@/utility/inputs/capitalize.js';
import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import { Compress, Delete, Expand, ExpandLess } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { grid } from '@mui/system';
import {
  changeSubTypePropertyDispatch,
  transformDropDownInputType,
} from '@/app/dispatches/glossary/changeSubTypePropertyDispatch.js';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';
import SubTypePreviewWrapper from '../previews/SubTypePreviewWrapper.js';
import SubTypeDropdownPreview from '../previews/SubTypeDropdownPreview.js';
import generatePropertyValue from '@/features/Glossary/utils/generatePropertyValue.js';
import { SubTypeDropdownData } from '../types.js';

const SubTypeDropDown = ({
  glossaryId,
  type,
  subTypeId,
  groupId,
  property,
  mode,
  propertyId,
  subPropertyId,
  subPropertySide,
}: {
  property: any;
  mode: 'focus' | 'form' | 'preview';
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subPropertyId?: string;
  subPropertySide?: 'left' | 'right';
}) => {
  const { getPropertyLabel } = usePropertyLabel();
  const [expand, setExpand] = useState(false);
  const [hoverString, setHoverString] = useState('');

  const options = useMemo(() => {
    if (property?.options) {
      return (
        [...property.options].sort((a: string, b: string) =>
          a.localeCompare(b)
        ) || []
      );
    }
    return [];
  }, [property?.options]);

  useEffect(() => {
    if (options.length <= 3 && expand) {
      setExpand(false);
    }
  }, [options.length, expand]);

  const { handleChange, handleTransform, isCompound } = useCompoundBridge({
    glossaryId,
    type,
    subTypeId,
    groupId,
    propertyId,
    mode,
    property,
    subPropertyId,
    subPropertySide,
  });

  const selectTypeOptions = isCompound
    ? [{ name: 'Single-Select', value: 'single' }]
    : [
        { name: 'Single-Select', value: 'single' },
        { name: 'Multi-Select', value: 'multi' },
      ];

  const source = useMemo(
    () => generatePropertyValue(property, propertyId) as SubTypeDropdownData,
    [property, propertyId]
  );

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <FieldDefinition
        mode={mode}
        property={property}
        handleChange={handleChange}
        sx={{ gridColumn: 'span 3' }}
        glossaryId={glossaryId}
        type={type}
        subTypeId={subTypeId}
        groupId={groupId}
        propertyId={propertyId}
        isCompound={isCompound}
        subPropertyId={subPropertyId}
        side={subPropertySide}
      />
      <Box
        sx={{
          display:
            property.selectType === 'multi' || mode === 'focus'
              ? 'grid'
              : 'flex',
          gridTemplateColumns: 'repeat(3, 1fr)',
          alignItems: 'start',
          gap: 2,
          width: '100%',
          flex: 1,
          gridColumn: 'span 3',
        }}
      >
        <FieldRow
          label="Select Type"
          mode={mode}
          sx={{
            gridColumn: mode === 'focus' ? 'span 3' : 'span 1',
            width: property.selectType === 'multi' ? '100%' : 'auto',
            mt: mode === 'focus' ? 1 : 0,
          }}
        >
          <SubTypeSelectWrapper
            property={property}
            mode={mode}
            onChange={(e) =>
              handleTransform(e.target.value as string, 'selectType')
            }
            options={selectTypeOptions}
            label="Select Type"
            keypath="selectType"
          />
        </FieldRow>
        {property.selectType === 'multi' && (
          <FieldRow
            label="Max Selections"
            mode={mode}
            sx={{ gridColumn: mode === 'focus' ? 'span 3' : 'span 1' }}
          >
            <TextField
              value={property?.maxSelections || ''}
              variant="outlined"
              label={mode === 'focus' ? '' : 'Max Selections'}
              placeholder="Enter max selections..."
              fullWidth
              onChange={(e) => handleChange(e.target.value, 'maxSelections')}
              type="number"
            />
          </FieldRow>
        )}
        <FieldRow
          label="Option Type"
          mode={mode}
          sx={{
            gridColumn: mode === 'focus' ? 'span 3' : 'span 1',
            width: property.selectType === 'multi' ? '100%' : 'auto',
          }}
        >
          <SubTypeSelectWrapper
            property={property}
            mode={mode}
            onChange={(e) =>
              handleTransform(e.target.value as string, 'optionType')
            }
            options={[
              { name: 'Entry Type', value: 'entryType' },
              { name: 'List', value: 'list' },
            ]}
            label="Option Type"
            keypath="optionType"
          />
        </FieldRow>
      </Box>
      {property?.optionType === 'entryType' && (
        <FieldRow label="Entry Type" mode={mode} sx={{ gridColumn: 'span 3' }}>
          <SubTypeSelectWrapper
            property={property}
            mode={mode}
            onChange={(e) =>
              handleChange(e.target.value as string, 'relationship')
            }
            options={glossaryEntryTypeOptions.map((type) => ({
              name: capitalize(getPropertyLabel('system', type).label || type),
              value: type,
            }))}
            label="Entry Type"
            keypath="relationship"
          />
        </FieldRow>
      )}
      {property?.optionType === 'list' && (
        <FieldRow
          label="Options"
          mode={mode}
          sx={{ gridColumn: 'span 3', mt: mode === 'focus' ? 1 : 0 }}
        >
          <TextField
            variant="outlined"
            label={mode === 'focus' ? '' : 'Options'}
            placeholder="Enter an Option and Press Enter"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value.length === 0) return;
                const currentOptions = property?.options || [];
                if (currentOptions.includes(value)) return;
                handleChange([...currentOptions, value], 'options');
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </FieldRow>
      )}
      {property?.optionType === 'list' && (
        <FieldRow
          label="Defined Options"
          mode={mode}
          alignItems="center"
          sx={{ gridColumn: 'span 3', mt: mode === 'focus' ? 1 : 0 }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                maxHeight: expand ? '100%' : '120px',
                overflowY: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                minHeight: 46,
                width: '100%',
              }}
            >
              {options && options.length > 3 && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }}
                  size="small"
                  onClick={() => setExpand(!expand)}
                >
                  {expand ? <Compress /> : <Expand />}
                </IconButton>
              )}
              {(options || []).map((option: string, index: number) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: 'start',
                  }}
                >
                  <MenuItem
                    sx={{
                      position: 'relative',
                      width: 'calc(100% - 40px)',
                      '&:hover': {
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      },
                      height: 36,
                    }}
                    onMouseEnter={() => setHoverString(option)}
                    onMouseLeave={() => setHoverString('')}
                    title={hoverString === option ? option : ''}
                  >
                    {hoverString === option && (
                      <IconButton
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                        onClick={() => {
                          const currentOptions = property?.options || [];
                          handleChange(
                            currentOptions.filter((o: string) => o !== option),
                            'options'
                          );
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                    <Typography sx={{ pl: 4 }}>{option}</Typography>
                  </MenuItem>
                </Box>
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                width: '100%',
                textAlign: 'left',
                position: 'absolute',
                left: 18,
                bottom: -22,
              }}
            >
              {property.options.length !== 1
                ? `${property.options?.length} options defined`
                : '1 option defined'}
            </Typography>
          </Box>
        </FieldRow>
      )}
      <Box sx={{ width: '100%', gridColumn: 'span 3' }}>
        {mode === 'focus' && (
          <SubTypePreviewWrapper>
            <SubTypeDropdownPreview
              property={property}
              isPreview={true}
              onChange={(val: any) => {}}
              source={source}
            />
          </SubTypePreviewWrapper>
        )}
      </Box>
    </Box>
  );
};

export default SubTypeDropDown;
