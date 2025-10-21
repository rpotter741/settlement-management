import { Box, Divider, Switch, Typography } from '@mui/material';
import { GlossaryEntryType } from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import FieldRow from '../../wrappers/FieldRow.js';
import SubTypeSelectWrapper from '../toggles/SubTypeSelectWrapper.js';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';
import SubTypeCheckBoxPreview from '../previews/SubTypeCheckboxPreview.js';
import SubTypePreviewWrapper from '../previews/SubTypePreviewWrapper.js';
import generatePropertyValue from '@/features/Glossary/utils/generatePropertyValue.js';
import { SubTypeCheckboxData } from '../types.js';

const SubTypeCheckbox = ({
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
  //
  const { handleChange, isCompound } = useCompoundBridge({
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
        subPropertyId={subPropertyId}
        side={subPropertySide}
      />
      <FieldRow
        label="Default Status"
        mode={mode}
        sx={{ gridColumn: 'span 3' }}
      >
        <SubTypeSelectWrapper
          property={property}
          mode={mode}
          onChange={(e) => handleChange(e.target.value, 'defaultChecked')}
          label="Default Status"
          keypath="defaultChecked"
          options={[
            { name: 'Checked', value: true },
            { name: 'Unchecked', value: false },
          ]}
        />
      </FieldRow>
      {mode === 'focus' && (
        <SubTypePreviewWrapper>
          <SubTypeCheckBoxPreview
            property={property}
            onChange={(val: any) => {}}
            isPreview={true}
            source={
              generatePropertyValue(property, propertyId) as SubTypeCheckboxData
            }
          />
        </SubTypePreviewWrapper>
      )}
    </>
  );
};

export default SubTypeCheckbox;
