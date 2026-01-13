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

const SubTypeTextInput = ({
  glossaryId,
  type,
  subTypeId,
  groupId,
  property,
  mode,
  propertyId,
  subPropertySide,
}: {
  property: any;
  mode: 'focus' | 'form' | 'preview';
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subPropertySide?: 'left' | 'right';
}) => {
  const { handleTransform, handleChange, isCompound } = useCompoundBridge({
    glossaryId,
    type,
    subTypeId,
    groupId,
    propertyId,
    property,
    subPropertySide,
  });

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
        glossaryId={glossaryId}
        type={type}
        subTypeId={subTypeId}
        groupId={groupId}
        propertyId={propertyId}
        isCompound={isCompound}
        side={subPropertySide}
      />
      <FieldRow
        label="Input Type"
        mode={mode}
        sx={{ gridColumn: 'span 1', gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        <SubTypeSelectWrapper
          onChange={(e) =>
            handleTransform(e.target.value as string, 'inputType')
          }
          property={property}
          mode={mode}
          keypath="inputType"
          options={filteredInputTypes}
          label="Input Type"
        />
      </FieldRow>

      {property.inputType === 'number' && (
        <FieldRow label="Value Label" mode={mode}>
          <TextField
            label={mode === 'focus' ? '' : 'Value Label'}
            sx={{ flex: 2, width: '100%' }}
            value={property?.valueLabel || ''}
            type="text"
            placeholder="None"
            onChange={(e) => handleChange(e.target.value, 'valueLabel')}
          />
        </FieldRow>
      )}
      {property.inputType === 'number' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: mode === 'focus' ? 'column' : 'row',
            alignItems: mode === 'focus' ? 'flex-start' : 'center',
            gap: mode === 'focus' ? 0 : 2,
            width: '100%',
            flex: 1,
          }}
        >
          <FieldRow label="Minimum Value" mode={mode}>
            <TextField
              label={mode === 'focus' ? '' : 'Minimum Value'}
              sx={{ flex: 2, width: '100%' }}
              value={property?.minValue || ''}
              type="number"
              placeholder="None"
              onChange={(e) => handleChange(e.target.value, 'minValue')}
            />
          </FieldRow>
          <FieldRow label="Maximum Value" mode={mode}>
            <TextField
              label={mode === 'focus' ? '' : 'Maximum Value'}
              sx={{ flex: 2, width: '100%' }}
              value={property?.maxValue || ''}
              type="number"
              placeholder="Infinity"
              onChange={(e) => handleChange(e.target.value, 'maxValue')}
            />
          </FieldRow>
        </Box>
      )}
      {property.inputType !== 'richtext' && (
        <FieldRow label="Default Value" mode={mode}>
          <TextField
            label={mode === 'focus' ? '' : 'Default Value'}
            sx={{ flex: 2, width: '100%' }}
            value={property?.defaultValue || ''}
            type={property.inputType === 'number' ? 'number' : 'text'}
            placeholder="None"
            onChange={(e) => handleChange(e.target.value, 'defaultValue')}
          />
        </FieldRow>
      )}
      {property.inputType === 'text' && (
        <FieldRow label="Text Transform" mode={mode}>
          <SubTypeSelectWrapper
            onChange={(e) => handleChange(e.target.value, 'textTransform')}
            property={property}
            mode={mode}
            keypath="textTransform"
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
      {mode === 'focus' && (
        <SubTypePreviewWrapper>
          {property.inputType !== 'richtext' ? (
            <SubTypeTextPreview
              property={property}
              onChange={(value: any) => {}}
              isPreview={true}
              source={generatePropertyValue(property, propertyId)}
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
