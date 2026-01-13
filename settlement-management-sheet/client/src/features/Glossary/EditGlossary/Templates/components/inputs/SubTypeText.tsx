import { TextField, Box, Typography, Divider } from '@mui/material';
import FieldRow from '../../wrappers/FieldRow.js';
import { GlossaryEntryType } from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import SubTypeSelectWrapper from '../toggles/SubTypeSelectWrapper.js';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';
import Editor from '@/components/shared/TipTap/Editor.js';
import SubTypeTextPreview from '../previews/SubTypeTextPreview.js';
import SubTypePreviewWrapper from '../previews/SubTypePreviewWrapper.js';
import generatePropertyValue from '@/features/Glossary/utils/generatePropertyValue.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { useState } from 'react';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';

const SubTypeTextInput = ({
  property,
  mode,
  propertyId,
  subPropertySide,
  source,
  onChange,
  subPropertyParent,
}: {
  property: any;
  mode: SubTypeModes;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subPropertySide?: 'left' | 'right';
  subPropertyParent?: SubTypeProperty;
  source: any;
  onChange: (value: any, keypath: string) => void;
}) => {
  const { handleTransform, handleChange, isCompound } = useCompoundBridge({
    propertyId,
    property,
    subPropertySide,
    subPropertyParent,
  });

  const [localValue, setLocalValue] = useState({ value: '' });
  const handleLocalChange = (value: any) => {
    setLocalValue({ value });
  };

  const filteredInputTypes = isCompound
    ? [
        {
          name: 'Text',
          value: 'text',
        },
        {
          name: 'Number',
          value: 'number',
        },
      ]
    : [
        {
          name: 'Text',
          value: 'text',
        },
        {
          name: 'Rich Text',
          value: 'richtext',
        },
        {
          name: 'Number',
          value: 'number',
        },
      ];

  return (
    <>
      <FieldDefinition
        mode={mode}
        property={property}
        handleChange={handleChange}
        propertyId={propertyId}
        isCompound={isCompound}
        side={subPropertySide}
        subPropertyParent={subPropertyParent}
      />
      <FieldRow
        label="Input Type"
        mode={mode}
        sx={{ gridColumn: 'span 1', gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        <SubTypeSelectWrapper
          onChange={(e) =>
            handleTransform(e.target.value as string, 'shape.inputType')
          }
          property={property}
          mode={mode}
          keypath="shape.inputType"
          options={filteredInputTypes}
          label="Input Type"
        />
      </FieldRow>

      {property.shape.inputType === 'number' && (
        <FieldRow label="Value Label" mode={mode}>
          <TextField
            label={mode === 'property' ? '' : 'Value Label'}
            sx={{ flex: 2, width: '100%' }}
            value={property?.shape.valueLabel || ''}
            type="text"
            placeholder="None"
            onChange={(e) => handleChange(e.target.value, 'shape.valueLabel')}
          />
        </FieldRow>
      )}
      {property.shape.inputType === 'number' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: mode === 'property' ? 'column' : 'row',
            alignItems: mode === 'property' ? 'flex-start' : 'center',
            gap: mode === 'property' ? 0 : 2,
            width: '100%',
            flex: 1,
          }}
        >
          <FieldRow label="Minimum Value" mode={mode}>
            <TextField
              label={mode === 'property' ? '' : 'Minimum Value'}
              sx={{ flex: 2, width: '100%' }}
              value={property?.shape.minValue || ''}
              type="number"
              placeholder="None"
              onChange={(e) => handleChange(e.target.value, 'shape.minValue')}
            />
          </FieldRow>
          <FieldRow label="Maximum Value" mode={mode}>
            <TextField
              label={mode === 'property' ? '' : 'Maximum Value'}
              sx={{ flex: 2, width: '100%' }}
              value={property?.shape.maxValue || ''}
              type="number"
              placeholder="Infinity"
              onChange={(e) => handleChange(e.target.value, 'shape.maxValue')}
            />
          </FieldRow>
        </Box>
      )}
      {property.shape.inputType !== 'richtext' && (
        <FieldRow label="Default Value" mode={mode}>
          <TextField
            label={mode === 'property' ? '' : 'Default Value'}
            sx={{ flex: 2, width: '100%' }}
            value={property?.shape.defaultValue || ''}
            type={property.shape.inputType === 'number' ? 'number' : 'text'}
            placeholder="None"
            onChange={(e) => handleChange(e.target.value, 'shape.defaultValue')}
          />
        </FieldRow>
      )}
      {property.shape.inputType === 'text' && (
        <FieldRow label="Text Transform" mode={mode}>
          <SubTypeSelectWrapper
            onChange={(e) =>
              handleChange(e.target.value, 'shape.textTransform')
            }
            property={property}
            mode={mode}
            keypath="shape.textTransform"
            options={[
              {
                name: 'None',
                value: 'none',
              },
              {
                name: 'Uppercase',
                value: 'uppercase',
              },
              {
                name: 'Lowercase',
                value: 'lowercase',
              },
              {
                name: 'Capitalize Each Word',
                value: 'capitalize',
              },
            ]}
            label="Text Transform"
          />
        </FieldRow>
      )}
      {mode === 'property' && (
        <SubTypePreviewWrapper>
          {property.shape.inputType !== 'richtext' ? (
            <SubTypeTextPreview
              property={property}
              onChange={handleLocalChange}
              source={localValue}
              keypath={''}
            />
          ) : (
            <Editor />
          )}
        </SubTypePreviewWrapper>
      )}
    </>
  );
};

export default SubTypeTextInput;
