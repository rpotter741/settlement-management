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
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { useState } from 'react';

const SubTypeCheckbox = ({
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
  propertyId: string;
  subPropertySide?: 'left' | 'right';
  subPropertyParent?: any;
  source: any;
  onChange: (value: any, keypath: string) => void;
}) => {
  //
  const { handleChange, isCompound } = useCompoundBridge({
    propertyId,
    property,
    subPropertySide,
  });

  //local state preview
  const [localValue, setLocalValue] = useState({ value: false });
  const handleLocalChange = (value: boolean) => {
    setLocalValue({ value });
  };

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
      {mode === 'property' && (
        <SubTypePreviewWrapper>
          <SubTypeCheckBoxPreview
            property={property}
            onChange={handleLocalChange}
            isPreview={true}
            source={localValue}
            keypath={``}
          />
        </SubTypePreviewWrapper>
      )}
    </>
  );
};

export default SubTypeCheckbox;
